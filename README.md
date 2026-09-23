# Fortis PDP previews

Static previews of the redesigned product detail page, one per brand, for sharing with stakeholders.

- `/arista/` — Mouse anti-Beta-LH Monoclonal Antibody, Clone 3 (ABBLH-0403)
- `/bethyl/` — Rabbit anti-HdmX/MDM4 Recombinant Monoclonal Antibody (A700-000)
- `/abcore/` — AbNano® Anti-NK-Cell VHH Library (L770-200)

## How it is built

`build.mjs` renders each page with the same markup as `PdpTemplate.tsx` in the storefront. It reads brand rules from `src/`, which holds copies of the storefront's `pdpBrandConfig.ts`, `pdpBrandContent.ts`, `pdpSpecGroups.ts` and `pdpProperties.ts`. `assets/pdp.css` is the storefront's `Pdp.module.css` with the `:global()` wrappers removed. Product data is in `data.mjs`.

To sync with the storefront and rebuild (Node 22.6+):

```sh
S=../fortis-nextjs-builderio-starter-storefront/components/page-templates/ProductDetail
cp $S/{pdpBrandConfig,pdpBrandContent,pdpSpecGroups,pdpProperties}.ts src/
sed -E 's/:global\(([^)]*)\)/\1/g' $S/Pdp.module.css > assets/pdp.css
node build.mjs
```
