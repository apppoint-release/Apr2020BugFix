# Automate BizAPP Config Transformations

This tutorial shows you how to automate BizAPP configs whenever the build is deployed or updated in any environment. BizAPP comes shipped with many config files that are customized depending on the staging or production setup. Automating the process of making these changes keeps you from having to do this process manually every time deployment is done that makes it tedious and error prone.

## Git Hooks

Config transformations are executed with the help of git hooks. Whenever there is an update to the BizAPP build on the public repo, running a simple pull on the server repository, will make these configurations executed automatically, keeping up-to-date with latest configuration changes.

### Hooks Setup
   Locate the .git\hooks folder under your BizAPP repository.
   - Create a new file named "post-merge"
   - Copy the below contents to the file.
 
```sh
#!C:/Program\ Files/Git/usr/bin/sh.exe
exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\.git\hooks\post-commit.ps1"
```
   ### Powershell File
   Copy the powershell file to .git\hook folder.
   [post-commit.ps1](post-commit.ps1)
    
## Config Transformation
BizAPP repository has a tool named "ctt.exe" under Tools folder which can be used to transform xdt based configurations.
The sample powershell script uses the same tool and runs transformations on the BizAPP config files. 

### Transforming registry configuration file
BizAPP.Runtime.Registry.Host.exe.config requires service configuration file for it to load the enterprise specific config file. This is usually specified in the element under appSettings config section.

With every build change, it becomes onerous on the deployment team to change the parameters to keep in sync. The below sample illustrates how it can be automated.

```sh
<?xml version="1.0"?> 
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform"> 
  <appSettings> 
     <add key="licenseserver" value="Address=192.168.2.200,127.0.0.1;Port=13333" xdt:Locator="Match(key)" xdt:Transform="Replace" />
     <add key="serviceconfigfile" value="F:\GitRepos\configs\External\Config.xml" xdt:Locator="Match(key)" xdt:Transform="Replace" />
  </appSettings>
</configuration> 
```
Every xdt transform file starts with xml namespace for the transform. In the above sample, both 'licenserver' and 'serviceconfigfile' element attributes are replaced with appropriate values.

## Summary
With xml data tranform (xdt), config files can be completely automated to have right values depending on the environment. These config transform files can come from another repository or reside in the same repository as BizAPP and referenced in the powershell script.
The powershell script provides a way to manage the config files as part of git hooks and completely eliminates the need for manual intervention of keeping changes in sync. This ensures deployments can be completely driven by automation with little need for manual oversight.