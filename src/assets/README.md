These SVG files are exported from Xara Photo & Graphic Designer and then used to creat the "*Icon" tsx files that are used
in the Atoll UI.

To create the Icon tsx files from the SVG do the following:

1. Use an existing *Icon.tsx file as a template (e.g. EditDetailIcon.tsx).
2. Remove the XML header:
   ```
        <?xml version="1.0" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        <!--Generator: Xara Designer (www.xara.com), SVG filter version: 6.3.0.31-->
   ```
3. Convert all of the xml style attributes to valid JSX attributes,
   for example, `fill-rule` becomes `fillRule`, `xmlns:xlink` becomes `xmlnsXlink`  
   NOTE: You can drop the style attribute: `style="font-variant-ligatures:none"`
4. At the SVG level you can add the attribute `className={props.className}`
   (this allows styling customization where the icon is used)
5. Where you see the `fill` attribute used you can substitue
   `fill="black"` (if color is dark, for example, `#0d2644` [*1])
   and use `className={fillClass}` as an attribute so that is fill color can be changed at
   runtime.
6. Where you see the `stroke` attribute used you can substitute
   `stroke="black"` (if color is dark, for example, `#0d2644` [*1])
   and use `className={strokeClass}` as an attribute so that is stroke color can be changed at
   runtime.

Notes:  
[*1] There shouldn't be light colors in the icon- the Atoll project styling dictates that icons
  should only have a single color that can be styled dynamically at runtime.
