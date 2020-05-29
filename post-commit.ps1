$configsTransformFolder = "..\configs\External"

# Registry config
echo "Transforming registry config"
& BizAPP\Tools\ctt.exe i s:BizAPP\BizAPP.Runtime.Registry.Host.exe.config t:"$configsTransformFolder\registry.transform.config" d:BizAPP\BizAPP.Runtime.Registry.Host.exe.config

# Add other transforms