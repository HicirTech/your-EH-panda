import * as fs from "fs";
const dir = 'E:/recrawlist'
const results = fs.readdirSync(dir).map (filename=>{
   const result =  fs.readFileSync(`${dir}/${filename}`,  {encoding:'utf8', flag:'r'});
   const jsonResult=JSON.parse(result)
   
   return jsonResult.subTitle
})


const data = JSON.stringify(results, null, 4);

try {
  fs.writeFileSync("reCrawlTitles.json", data);
  console.log("JSON data is saved.");
} catch (error) {
  console.error(error);
}
