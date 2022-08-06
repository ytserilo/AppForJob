import {Plugin} from "esbuild";
import { writeFile } from "fs/promises";
import path from "path";

interface HTMLOptions{
    cssPath: string[],
    jsPath: string[],

}
function renderHTML(options: HTMLOptions): string{
    return `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Currency</title>
            ${options?.cssPath?.map(path => `<link href=${path} rel="stylesheet">`).join(" ")}
        </head>
        <body>
            <div id="root"></div>
            ${options?.jsPath?.map(path => `<script src=${path}></script>`).join(" ")}
        </body>
    </html>
    `
}

function preparePaths(outputs: string[]){
    return outputs.reduce<Array<string[]>>((acc, path) => {
        const [css, js] = acc;
        let fileName = path.split("/").pop();

        if(fileName?.endsWith("js")){
            js.push(path);
        }else if(fileName?.endsWith("css")){
            css.push(path);
        }

        return acc;
    }, [[], []]);
}

export const HTMLPlugin: Plugin = {
    name: "HTMLPlugin",
    setup(build){
        build.onEnd(async (result) => {
            const outdir = build.initialOptions.outdir;
            const outputs = result.metafile?.outputs;
            const [cssPath, jsPath] = preparePaths(Object.keys(outputs || {}));

            if(outdir) {
                await writeFile(
                    path.resolve(outdir, 'index.html'),
                    renderHTML({ jsPath, cssPath })
                )
            }
        })
    }
}