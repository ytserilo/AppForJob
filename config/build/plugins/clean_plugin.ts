import {Plugin} from "esbuild";
import {rm} from "fs/promises";

export const CleanPlugin: Plugin = {
    name: 'CleanPlugin',
    setup(build) {
      build.onStart(async () => {
        try{
            const dir = build.initialOptions.outdir;
            if(dir){
                await rm(dir, {recursive: true});
            }
        }
        catch(e){
            console.log("Don't to remove folder");
        }
      });
    },
  }
  