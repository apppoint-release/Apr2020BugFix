<%@ page language="C#" autoeventwireup="true" inherits="ForgotPasswordPage, App_Web_forgotpasswordpage.aspx.cdcab7d2" %>

<asp:Literal runat="server" id="doctype"></asp:Literal>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>Untitled Page</title>

	<script type="text/javascript" language="javascript" src="<%= Page.ResolveUrl( "~/Resources/Javascripts/BizAPP.js?v=" + BizAPP.Web.UI.Renderer.RenderHelper.BuildTimeStamp ) %>"></script>

	<script language="javascript" type="text/javascript">
		function callViewInitialize() 
		{
			setResize(true);
			callResize();
		}
	</script>

</head>
<body onload="initializeStartUp();" style="overflow: hidden;" class="forgotpasswordpage">
	<form id="form1" runat="server" enterprise="1">
	<asp:Panel runat="server" ID="ViewContainer" bizappid="ViewContainer" >
	</asp:Panel>
	</form>
</body>
</html>
