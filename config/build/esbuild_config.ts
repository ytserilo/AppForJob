import ESBuild from "esbuild";
import path from "path";
import { CleanPlugin } from "./plugins/clean_plugin";
import { HTMLPlugin } from "./plugins/html_plugin";

function rootResolve(...segments: string[]){
    return path.resolve(__dirname, "..", "..", ...segments);
}

ESBuild.build({
    entryPoints: [rootResolve("src", "index.tsx")],
    entryNames: "[dir]/bundle.[name]-[hash]",
    outdir: rootResolve("build"),
    bundle: true,
    tsconfig: rootResolve("tsconfig.json"),
    minify: true,
    metafile: true,
    loader: { '.svg': 'file' },
    plugins: [CleanPlugin, HTMLPlugin]
}).catch(() => process.exit(1));