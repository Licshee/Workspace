
// 定义小工具的名称、包含的文件、启动项目
var appName = "JSMin";
var appFiles = ["install.js", "jsmin.hta", "jsmin.js"];
var appExec = "jsmin.hta";


// 如有必要，则将小工具复制到特定的路径
var wshShell = new ActiveXObject("WScript.Shell");

var regUSF = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders\\";
var xrptFull = WScript.ScriptFullName;
var xrptPath = xrptFull.substring(0, xrptFull.lastIndexOf("\\"));
var appsPath = wshShell.ExpandEnvironmentStrings(wshShell.RegRead(regUSF + "Personal")) + "\\!Scriptlet";
var instPath = appsPath + "\\" + appName;


if(instPath.toLowerCase() != xrptPath.toLowerCase()){
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  try{
    var folder = fso.CreateFolder(appsPath);
    folder.Attributes = folder.Attributes | 2;
  }catch(ex){ }
  try{
    fso.CreateFolder(instPath);
  }catch(ex){ }

  for(var i = 0; i < appFiles.length; i++){
    fso.CopyFile(xrptPath + "\\" + appFiles[i], instPath + "\\");
  }

  try{
    fso.OpenTextFile(instPath + "\\" + appExec + ":Zone.Identifier", 1).Close();
    fso.OpenTextFile(instPath + "\\" + appExec + ":Zone.Identifier", 2).Close();
  }catch(ex){ }
}


// 设置文件关联
var asocType = "JSFile";
var asocAction = "JSMin";
var asocDescription = "Minimize";
// 由于工具并非二进制可执行文件，所以需要从注册表中读取关联设置
var asocCommand = wshShell.RegRead("HKEY_CLASSES_ROOT\\htafile\\Shell\\Open\\Command\\").replace("%1", instPath + "\\" + appExec).replace("%*", '"%1"');

// 该写注册表以设置文件关联。
var regAType = "HKCU\\Software\\Classes\\" + asocType + "\\";
var regAShell = regAType + "Shell\\";
var regAAction = regAShell + asocAction + "\\";
var regACommand = regAAction + "Command\\";

wshShell.RegWrite(regAAction, asocDescription);
wshShell.RegWrite(regACommand, asocCommand);

WScript.Echo("已经成功关联了JSMin工具。");
