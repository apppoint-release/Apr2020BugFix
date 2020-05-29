# Automate BizAPP Config Transformations

This tutorial shows you how to automate BizAPP configs whenever the build is deployed or updated in any environment. BizAPP comes shipped with many config files that are customized depending on the staging or production setup. Automating the process of making these changes keeps you from having to do this manually every time upgrade is done which makes it tedious and error prone.

## Git Hooks

Config transformations are executed with the help of git hooks. Whenever there is an update to the BizAPP build on the public repository, running a simple fetch and pull on the server repository, will make these configurations executed automatically, keeping up-to-date with latest configuration changes.

### Hooks Setup
   Locate .git\hooks folder under your BizAPP repository.
   - Create a new file named "post-merge"
   - Copy the below contents to the file.
 
```sh
#!C:/Program\ Files/Git/usr/bin/sh.exe
exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\.git\hooks\post-commit.ps1"
```
   ### Powershell File
   Copy [post-commit.ps1](post-commit.ps1) to .git\hook folder. Add additional snippets to transform other config files.
    
## Config Transformation
BizAPP repository has a tool named "ctt.exe" under BizAPP\Tools folder which can be used to transform any xdt based configurations.
The sample powershell script(that is part of the repository) uses the same tool and runs transformations on the BizAPP config files.

### Sample - Transforming registry configuration file
BizAPP.Runtime.Registry.Host.exe.config requires service configuration file for it to load the enterprise specific config file. This is usually specified in the element under appSettings config section.

With every build change, it becomes onerous on the deployment team to keep the parameters in sync. The below sample illustrates how it can be automated. Create a new file named "registry.transform.config" and keep it a folder named "External". Copy the below contents to the file.

```sh
<?xml version="1.0"?> 
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform"> 
  <appSettings> 
     <add key="licenseserver" value="Address=192.168.2.200,127.0.0.1;Port=13333" xdt:Locator="Match(key)" xdt:Transform="Replace" />
     <add key="serviceconfigfile" value="F:\GitRepos\configs\External\Config.xml" xdt:Locator="Match(key)" xdt:Transform="Replace" />
  </appSettings>
</configuration> 
```
Every transform file mandatorily starts with xml namespace for the transform. In the above sample, both 'licenserver' and 'serviceconfigfile' element attributes are replaced with appropriate values.

## Summary
With xml data tranform (xdt), config files can be completely automated to have correct values depending on the deployment environment. These config transform files can come from another repository or reside in the same repository as BizAPP and be referenced in the powershell script.

The powershell script provides a way to manage the config files as part of git hooks and completely eliminates the need for manual intervention, thus increasing the quality and predictability of the upgrades.
