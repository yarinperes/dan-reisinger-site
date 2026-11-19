import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  contactEmail: z.string().trim().email().max(255),
  employeeCount: z.number().int().min(1).max(100000),
  printsPerEmployee: z.number().int().min(1).max(10),
  accessCode: z.string().trim().min(4).max(24).regex(/^[A-Za-z0-9-]+$/),
  deadline: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

function isPastDeadline(deadline: string | null) {
  if (!deadline) return false;
  const end = new Date(`${deadline}T23:59:59`);
  return Date.now() > end.getTime();
}

const codeSchema = z.object({ code: z.string().trim().min(3).max(24) });

const selectionSchema = z.object({
  code: z.string().trim().min(3).max(24),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).default(""),
  email: z.string().trim().email().max(255),
  prints: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(40),
        title: z.string().trim().max(200).default(""),
      }),
    )
    .min(1)
    .max(10),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const code = data.accessCode.toUpperCase();
    const { data: row, error } = await context.supabase
      .from("orders")
      .insert({
        owner_id: context.userId,
        company_name: data.companyName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        employee_count: data.employeeCount,
        prints_per_employee: data.printsPerEmployee,
        access_code: code,
        deadline: data.deadline || null,
      })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("code_taken");
      throw new Error(error.message);
    }
    return { id: row.id as string, accessCode: code };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, company_name, access_code, employee_count, prints_per_employee, closed, created_at, selections(count)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((o) => ({
      id: o.id as string,
      companyName: o.company_name as string,
      accessCode: o.access_code as string,
      employeeCount: o.employee_count as number,
      printsPerEmployee: o.prints_per_employee as number,
      closed: o.closed as boolean,
      createdAt: o.created_at as string,
      selectionCount:
        (o as unknown as { selections: Array<{ count: number }> }).selections?.[0]?.count ?? 0,
    }));
  });

export const getOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("not_found");
    const { data: sel, error: selError } = await context.supabase
      .from("selections")
      .select("*")
      .eq("order_id", data.id)
      .order("created_at", { ascending: false });
    if (selError) throw new Error(selError.message);
    return {
      order: {
        id: order.id as string,
        companyName: order.company_name as string,
        contactName: order.contact_name as string,
        contactEmail: order.contact_email as string,
        employeeCount: order.employee_count as number,
        printsPerEmployee: order.prints_per_employee as number,
        accessCode: order.access_code as string,
        closed: order.closed as boolean,
        deadline: (order.deadline as string | null) ?? null,
      },
      selections: (sel ?? []).map((s) => ({
        id: s.id as string,
        firstName: s.first_name as string,
        lastName: s.last_name as string,
        phone: s.phone as string,
        email: s.email as string,
        printId: s.print_id as string,
        createdAt: s.created_at as string,
      })),
    };
  });

export const setOrderClosed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), closed: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ closed: data.closed })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("orders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Public: employees enter the access code they got from HR. */
export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => codeSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, company_name, prints_per_employee, closed, deadline")
      .eq("access_code", data.code.trim().toUpperCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) return { found: false as const };
    return {
      found: true as const,
      companyName: order.company_name as string,
      printsPerEmployee: order.prints_per_employee as number,
      closed: order.closed as boolean || isPastDeadline(order.deadline as string | null),
      deadline: (order.deadline as string | null) ?? null,
    };
  });

/** Public: employee submits their gift choice using the access code. */
export const submitSelection = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => selectionSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, closed, deadline, prints_per_employee")
      .eq("access_code", data.code.trim().toUpperCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("invalid_code");
    if (data.prints.length !== (order.prints_per_employee as number))
      throw new Error("wrong_count");
    if (order.closed || isPastDeadline(order.deadline as string | null))
      throw new Error("order_closed");
    const { error: insertError } = await supabaseAdmin.from("selections").insert(
      data.prints.map((p) => ({
        order_id: order.id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        email: data.email,
        print_id: p.id,
        print_title: p.title,
      })),
    );
    if (insertError) throw new Error(insertError.message);
    return { ok: true };
  });
