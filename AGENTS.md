<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Splash marquee tracks use two equal groups with trailing spacing inside each group; this makes the half-width animation loop seamless.
- Splash posters use fixed responsive boxes and contain sizing; artwork proportions cannot be cropped or change track layout during decoding.
- Keep persistent print IDs independent of the numbered filename manifest; derive the shared gallery from that manifest so reordering never changes saved selections.
