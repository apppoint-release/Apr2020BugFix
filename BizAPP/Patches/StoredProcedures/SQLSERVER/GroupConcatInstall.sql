-- Turn advanced options on
EXEC sys.sp_configure @configname = 'show advanced options', @configvalue = 1 ;
GO
RECONFIGURE WITH OVERRIDE ;
GO
-- Enable CLR
EXEC sys.sp_configure @configname = 'clr enabled', @configvalue = 1 ;
GO
RECONFIGURE WITH OVERRIDE ;
GO
-------------------------------------------------------------------------------------------------------------------------------
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, QUOTED_IDENTIFIER ON;
SET CONCAT_NULL_YIELDS_NULL, NUMERIC_ROUNDABORT OFF;
GO
IF EXISTS (SELECT * FROM tempdb..sysobjects WHERE id=OBJECT_ID('tempdb..#tmpErrors')) DROP TABLE #tmpErrors
GO
CREATE TABLE #tmpErrors (Error int)
GO
SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL READ COMMITTED
GO
BEGIN TRANSACTION
GO
-------------------------------------------------------------------------------------------------------------------
PRINT N'Creating [GroupConcat]...';
GO
CREATE ASSEMBLY [GroupConcat]
    AUTHORIZATION [dbo]
	FROM 0x4D5A90000300000004000000FFFF0000B800000000000000400000000000000000000000000000000000000000000000000000000000000000000000800000000E1FBA0E00B409CD21B8014CCD21546869732070726F6772616D2063616E6E6F742062652072756E20696E20444F53206D6F64652E0D0D0A2400000000000000504500004C01030058898C510000000000000000E00002210B010B00001E000000080000000000007E3D0000002000000040000000000010002000000002000004000000000000000400000000000000008000000002000000000000030040850000100000100000000010000010000000000000100000000000000000000000243D000057000000004000003804000000000000000000000000000000000000006000000C00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000080000000000000000000000082000004800000000000000000000002E74657874000000841D000000200000001E000000020000000000000000000000000000200000602E7273726300000038040000004000000006000000200000000000000000000000000000400000402E72656C6F6300000C0000000060000000020000002600000000000000000000000000004000004200000000000000000000000000000000603D0000000000004800000002000500C02C00006410000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003202731100000A7D010000042A0000001330040047000000010000110F01281200000A2D3D0F01281300000A0A027B01000004066F1400000A2C1A027B01000004250B06250C07086F1500000A17586F1600000A2A027B0100000406176F1700000A2A001B30050089000000020000110F017B010000046F1800000A0C2B601202281900000A0A1200281A00000A0B027B01000004076F1400000A2C29027B01000004250D072513040911046F1500000A0F017B01000004076F1500000A586F1600000A2B19027B01000004070F017B01000004076F1500000A6F1700000A1202281B00000A2D97DE0E1202FE160300001B6F1C00000ADC2A0000000110000002000D006D7A000E000000001B3003009B00000003000011027B010000043989000000027B010000046F1D00000A16317B731E00000A0A027B010000046F1800000A0D2B341203281900000A0B160C2B1E061201281A00000A6F1F00000A260672010000706F1F00000A260817580C081201282000000A32D81203281B00000A2DC3DE0E1203FE160300001B6F1C00000ADC06066F2100000A1759176F2200000A6F2300000A282400000A2A14282400000A2A000110000002002B00416C000E00000000133003003900000004000011036F2500000A0A0206732600000A7D01000004160B2B1B027B01000004036F2700000A036F2500000A6F1700000A0717580B0706175931DF2A0000001B3002005B0000000500001103027B010000046F1D00000A6F2800000A027B010000046F1800000A0B2B221201281900000A0A031200281A00000A6F2900000A031200282000000A6F2800000A1201281B00000A2DD5DE0E1201FE160300001B6F1C00000ADC2A000110000002001D002F4C000E000000001330020024000000060000110F01FE16060000016F2300000A0A027B0300000406282A00000A2C0702067D030000042A5E02731100000A7D02000004027E2B00000A7D030000042A133004004F000000010000110F01281200000A2D450F01281300000A0A027B02000004066F1400000A2C1B027B02000004250B06250C07086F1500000A17586F1600000A2B0D027B0200000406176F1700000A020428070000062A001B300500A300000002000011027B03000004282C00000A2C0D020F017B030000047D030000040F017B020000046F1800000A0C2B601202281900000A0A1200281A00000A0B027B02000004076F1400000A2C29027B02000004250D072513040911046F1500000A0F017B02000004076F1500000A586F1600000A2B19027B02000004070F017B02000004076F1500000A6F1700000A1202281B00000A2D97DE0E1202FE160300001B6F1C00000ADC2A0001100000020027006D94000E000000001B300300B300000003000011027B0200000439A1000000027B020000046F1D00000A163E90000000731E00000A0A027B020000046F1800000A0D2B351203281900000A0B160C2B1F061201281A00000A6F1F00000A2606027B030000046F1F00000A260817580C081201282000000A32D71203281B00000A2DC2DE0E1203FE160300001B6F1C00000ADC06066F2100000A027B030000046F2D00000A59027B030000046F2D00000A6F2200000A6F2300000A282400000A2A14282400000A2A000110000002002E004270000E00000000133003004500000004000011036F2500000A0A0206732600000A7D02000004160B2B1B027B02000004036F2700000A036F2500000A6F1700000A0717580B0706175931DF02036F2700000A7D030000042A0000001B300200670000000500001103027B020000046F1D00000A6F2800000A027B020000046F1800000A0B2B221201281900000A0A031200281A00000A6F2900000A031200282000000A6F2800000A1201281B00000A2DD5DE0E1201FE160300001B6F1C00000ADC03027B030000046F2900000A2A000110000002001D002F4C000E000000001330020024000000060000110F01FE16060000016F2300000A0A027B0500000406282A00000A2C0702067D050000042AEA027B060000042D310F01282E00000A172E150F01282E00000A182E0B7205000070732F00000A7A020F01282E00000A283000000A7D060000042A7A02731100000A7D04000004027E2B00000A7D0500000402167D060000042A00001330040056000000010000110F01281200000A2D4C0F01281300000A0A027B04000004066F1400000A2C1B027B04000004250B06250C07086F1500000A17586F1600000A2B0D027B0400000406176F1700000A0204280E0000060205280F0000062A00001B300500B800000002000011027B05000004282C00000A2C0D020F017B050000047D05000004027B060000042D0D020F017B060000047D060000040F017B040000046F1800000A0C2B601202281900000A0A1200281A00000A0B027B04000004076F1400000A2C29027B04000004250D072513040911046F1500000A0F017B04000004076F1500000A586F1600000A2B19027B04000004070F017B04000004076F1500000A6F1700000A1202281B00000A2D97DE0E1202FE160300001B6F1C00000ADC2A0110000002003C006DA9000E000000001B300300D700000007000011027B0400000439C5000000027B040000046F1D00000A163EB4000000731E00000A0B027B06000004183313027B04000004731E000006733100000A0A2B0C027B04000004733200000A0A066F3300000A13042B351204283400000A0C160D2B1F071202281A00000A6F1F00000A2607027B050000046F1F00000A260917580D091202282000000A32D71204283500000A2DC2DE0E1204FE160600001B6F1C00000ADC07076F2100000A027B050000046F2D00000A59027B050000046F2D00000A6F2200000A6F2300000A282400000A2A14282400000A2A0001100000020052004294000E00000000133003005100000004000011036F2500000A0A0206732600000A7D04000004160B2B1B027B04000004036F2700000A036F2500000A6F1700000A0717580B0706175931DF02036F2700000A7D0500000402036F3600000A7D060000042A0000001B300200730000000500001103027B040000046F1D00000A6F2800000A027B040000046F1800000A0B2B221201281900000A0A031200281A00000A6F2900000A031200282000000A6F2800000A1201281B00000A2DD5DE0E1201FE160300001B6F1C00000ADC03027B050000046F2900000A03027B060000046F3700000A2A000110000002001D002F4C000E00000000EA027B080000042D310F01282E00000A172E150F01282E00000A182E0B7205000070732F00000A7A020F01282E00000A283000000A7D080000042A4E02731100000A7D0700000402167D080000042A00133004004F000000010000110F01281200000A2D450F01281300000A0A027B07000004066F1400000A2C1B027B07000004250B06250C07086F1500000A17586F1600000A2B0D027B0700000406176F1700000A020428160000062A001B3005009E00000002000011027B080000042D0D020F017B080000047D080000040F017B070000046F1800000A0C2B601202281900000A0A1200281A00000A0B027B07000004076F1400000A2C29027B07000004250D072513040911046F1500000A0F017B07000004076F1500000A586F1600000A2B19027B07000004070F017B07000004076F1500000A6F1700000A1202281B00000A2D97DE0E1202FE160300001B6F1C00000ADC2A000001100000020022006D8F000E000000001B300300C800000008000011027B0700000439B6000000027B070000046F1D00000A163EA5000000731E00000A0B027B08000004183313027B07000004731E000006733100000A0A2B0C027B07000004733200000A0A066F3300000A13052B3A1205283400000A0C1202281A00000A0D1613042B1A07096F1F00000A260772010000706F1F00000A2611041758130411041202282000000A32DB1205283500000A2DBDDE0E1205FE160600001B6F1C00000ADC07076F2100000A1759176F2200000A6F2300000A282400000A2A14282400000A2A01100000020052004799000E00000000133003004500000004000011036F2500000A0A0206732600000A7D07000004160B2B1B027B07000004036F2700000A036F2500000A6F1700000A0717580B0706175931DF02036F3600000A7D080000042A0000001B300200670000000500001103027B070000046F1D00000A6F2800000A027B070000046F1800000A0B2B221201281900000A0A031200281A00000A6F2900000A031200282000000A6F2800000A1201281B00000A2DD5DE0E1201FE160300001B6F1C00000ADC03027B080000046F3700000A2A000110000002001D002F4C000E000000002204036F3800000A2A1E02283900000A2A00000042534A4201000100000000000C00000076322E302E35303732370000000005006C000000C4060000237E0000300700006405000023537472696E677300000000940C00006C00000023555300000D0000100000002347554944000000100D00005403000023426C6F6200000000000000020000015717A2090900000000FA253300160000010000002500000006000000080000001E0000001E0000000500000039000000180000000800000003000000040000000400000006000000010000000300000000000A00010000000000060081007A000A00B20097000600C3007A000600E500CA000600F100CA000A001F010A0106004E0144010600600144010A009C010A010A00CA01970006001702050206002E02050206004B02050206006A02050206008302050206009C0205020600B70205020600D202050206000A03EB0206001E030502060057033703060077033703060095037A000A00AB0397000A00CC0397000600D303EB020600E903EB0217002B04000006004404CA00060070047A0006009A048E040600EB047A00060014057A0006001E057A000E002D05CA0006004005CA008F002B0400000000000001000000000001000100092110001A00270005000100010009211000330027000500020007000921100042002700050004000E00092110005200270005000700160001001000610027000D0009001D000100FE0010000100FE0010000100730139000100FE001000010073013900010095014F000100FE001000010095014F005020000000008600050118000100602000000000860029011C000100B4200000000086003401220002005C210000000086003A0128000300142200000000E6015B012D0004005C2200000000E6016D0133000500D4220000000081087D011C00060004230000000086000501180007001C2300000000860029013C000700782300000000860034014400090038240000000086003A0128000A00082500000000E6015B012D000B005C2500000000E6016D0133000C00E0250000000081087D011C000D001026000000008108A40152000E004B26000000008600050118000F006C26000000008600290158000F00D026000000008600340162001200A4270000000086003A0128001300982800000000E6015B012D001400F82800000000E6016D01330015008829000000008108A40152001600C329000000008600050118001700D82900000000860029016D001700342A000000008600340175001900F02A0000000086003A0128001A00D42B00000000E6015B012D001B00282C00000000E6016D0133001C00AC2C00000000E601B6017B001D00B52C000000008618BE0118001F0000000100C40100000100DC0100000000000000000100E20100000100E40100000100E60100000100C40100000200EC0100000100DC0100000000000000000100E20100000100E40100000100E60100000100E60100000100C40100000200EC0100000300F60100000100DC0100000000000000000100E20100000100E40100000100E60100000100C40100000200F60100000100DC0100000000000000000100E20100000100E40100000100010200000200030202000900030009000400090005000900060006005100BE0118005900BE01BA006100BE01BA006900BE01BA007100BE01BA007900BE01BA008100BE01BA008900BE01BA009100BE01BA009900BE01BF00A100BE01BA00A900BE01C400B100BE011800B900BE011800C100BE01C900D100BE0142011400BE0118003100F4034F013100FF035301140009045701140015045D0114001E0464011400270464011400360477011C005304890124005F049B011C0067044F01F1007C04180014008404B701F900BE011800F900A804BB012400FF03C101F900AF04B701F900BA04C6011900C10453013100CA04CD013900D604B7011400BE01C4003900E004530141006D01C40041006D01BA000101F204F9010101000539000101060503020101AF04B7014900FF0308020901BE01BA00110126050C022C00BE0119022C00BE012C022C0036043902340053048901340067044F0139004E05080241006D0167020101570587021900BE01180024000B0081002E006B0035032E002B000E032E0013008C022E001B009D022E0023000E032E003B0014032E0033008C022E0043000E032E0053000E032E0063002C0343007B00CF0063007B00CF0064000B00940083007B00CF00A3007B00CF00E4000B00810004010B00A70044010B009400E4010B00810004020B00A70064020B009400E4020B00810044030B0094006C01A001D301E501EA01FF014D026C0203000100040002000500040000008B014A0000008B014A000000AF0168000000AF01680001000700030001000E00050001000F0007000100160009000A004801820194011102450204800000010000000D13F49F00000000000027000000020000000000000000000000010071000000000002000000000000000000000001008B000000000002000000000000000000000001007A000000000000000000003C4D6F64756C653E0047726F7570436F6E6361742E646C6C0047524F55505F434F4E4341540047726F7570436F6E6361740047524F55505F434F4E4341545F440047524F55505F434F4E4341545F44530047524F55505F434F4E4341545F530052657665727365436F6D7061726572006D73636F726C69620053797374656D0056616C7565547970650053797374656D2E44617461004D6963726F736F66742E53716C5365727665722E536572766572004942696E61727953657269616C697A65004F626A6563740053797374656D2E436F6C6C656374696F6E732E47656E657269630049436F6D706172657260310044696374696F6E61727960320076616C75657300496E69740053797374656D2E446174612E53716C54797065730053716C537472696E6700416363756D756C617465004D65726765005465726D696E6174650053797374656D2E494F0042696E61727952656164657200526561640042696E6172795772697465720057726974650064656C696D69746572007365745F44656C696D697465720044656C696D6974657200736F727442790053716C42797465007365745F536F7274427900536F7274427900436F6D70617265002E63746F720056414C55450053716C46616365744174747269627574650047726F7570007200770076616C75650044454C494D4954455200534F52545F4F52444552007800790053797374656D2E5265666C656374696F6E00417373656D626C795469746C6541747472696275746500417373656D626C794465736372697074696F6E41747472696275746500417373656D626C79436F6E66696775726174696F6E41747472696275746500417373656D626C79436F6D70616E7941747472696275746500417373656D626C7950726F6475637441747472696275746500417373656D626C79436F7079726967687441747472696275746500417373656D626C7954726164656D61726B41747472696275746500417373656D626C7943756C747572654174747269627574650053797374656D2E52756E74696D652E496E7465726F70536572766963657300436F6D56697369626C6541747472696275746500417373656D626C7956657273696F6E4174747269627574650053797374656D2E52756E74696D652E436F6D70696C6572536572766963657300436F6D70696C6174696F6E52656C61786174696F6E734174747269627574650052756E74696D65436F6D7061746962696C6974794174747269627574650053657269616C697A61626C654174747269627574650053716C55736572446566696E656441676772656761746541747472696275746500466F726D6174005374727563744C61796F7574417474726962757465004C61796F75744B696E64006765745F49734E756C6C006765745F56616C756500436F6E7461696E734B6579006765745F4974656D007365745F4974656D0041646400456E756D657261746F7200476574456E756D657261746F72004B657956616C7565506169726032006765745F43757272656E74006765745F4B6579004D6F76654E6578740049446973706F7361626C6500446973706F7365006765745F436F756E740053797374656D2E5465787400537472696E674275696C64657200417070656E64006765745F4C656E6774680052656D6F766500546F537472696E67006F705F496D706C696369740052656164496E7433320052656164537472696E6700537472696E67006F705F496E657175616C69747900456D7074790049734E756C6C4F72456D70747900457863657074696F6E00436F6E7665727400546F4279746500536F7274656444696374696F6E6172796032004944696374696F6E617279603200526561644279746500436F6D70617265546F0000000000032C00006549006E00760061006C0069006400200053006F0072007400420079002000760061006C00750065003A00200075007300650020003100200066006F007200200041005300430020006F00720020003200200066006F007200200044004500530043002E0000008002D97266C26949A672EA780F71C8980008B77A5C561934E08905151211010E0706151215020E0803200001052001011119052001011108042000111905200101121D05200101122102060E072002011119111905200101110C04280011190206050520010111250920030111191119112505200101111004280011250720020111191125052001011114052002080E0E12010001005408074D617853697A65A00F000012010001005408074D617853697A65FFFFFFFF12010001005408074D617853697A6504000000042001010E0420010102042001010805200101116572010002000000050054080B4D61784279746553697A65FFFFFFFF5402124973496E76617269616E74546F4E756C6C73015402174973496E76617269616E74546F4475706C696361746573005402124973496E76617269616E74546F4F726465720154020D49734E756C6C4966456D7074790105200101116D06151215020E08032000020320000E0520010213000620011301130007200201130013010A07030E151215020E080E0A2000151171021300130106151171020E080A2000151175021300130106151175020E080420001300160705151175020E080E151171020E08151215020E080E03200008052001127D0E0420001301062002127D080805000111190E110704127D151175020E0808151171020E0804070208080E0702151175020E08151171020E08050002020E0E0307010E040001020E032000050400010505071512808D020E08122002011512809102130013011512110113000C2001011512809102130013010B20001511809502130013010715118095020E081907051512808D020E08127D151175020E080815118095020E0804200101051A07061512808D020E08127D151175020E080E0815118095020E08042001080E1001000B47726F7570436F6E63617400007001006B537472696E6720636F6E636174656E6174696F6E2061676772656761746520666F722053514C205365727665722E2044726F702D696E207265706C6163656D656E7420666F72206275696C742D696E204D7953514C2047524F55505F434F4E4341542066756E74696F6E2E000005010000000017010012436F7079726967687420C2A920203230313100000801000800000000001E01000100540216577261704E6F6E457863657074696F6E5468726F7773014C3D000000000000000000006E3D0000002000000000000000000000000000000000000000000000603D00000000000000000000000000000000000000005F436F72446C6C4D61696E006D73636F7265652E646C6C0000000000FF25002000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100100000001800008000000000000000000000000000000100010000003000008000000000000000000000000000000100000000004800000058400000E00300000000000000000000E00334000000560053005F00560045005200530049004F004E005F0049004E0046004F0000000000BD04EFFE0000010000000100F49F0D1300000100F49F0D133F000000000000000400000002000000000000000000000000000000440000000100560061007200460069006C00650049006E0066006F00000000002400040000005400720061006E0073006C006100740069006F006E00000000000000B00440030000010053007400720069006E006700460069006C00650049006E0066006F0000001C0300000100300030003000300030003400620030000000F0006C00010043006F006D006D0065006E0074007300000053007400720069006E006700200063006F006E0063006100740065006E006100740069006F006E002000610067006700720065006700610074006500200066006F0072002000530051004C0020005300650072007600650072002E002000440072006F0070002D0069006E0020007200650070006C006100630065006D0065006E007400200066006F00720020006200750069006C0074002D0069006E0020004D007900530051004C002000470052004F00550050005F0043004F004E004300410054002000660075006E00740069006F006E002E00000040000C000100460069006C0065004400650073006300720069007000740069006F006E0000000000470072006F007500700043006F006E00630061007400000040000F000100460069006C006500560065007200730069006F006E000000000031002E0030002E0034003800370037002E00340030003900340038000000000040001000010049006E007400650072006E0061006C004E0061006D0065000000470072006F007500700043006F006E006300610074002E0064006C006C0000004800120001004C006500670061006C0043006F007000790072006900670068007400000043006F0070007900720069006700680074002000A90020002000320030003100310000004800100001004F0072006900670069006E0061006C00460069006C0065006E0061006D0065000000470072006F007500700043006F006E006300610074002E0064006C006C00000038000C000100500072006F0064007500630074004E0061006D00650000000000470072006F007500700043006F006E00630061007400000044000F000100500072006F006400750063007400560065007200730069006F006E00000031002E0030002E0034003800370037002E00340030003900340038000000000048000F00010041007300730065006D0062006C0079002000560065007200730069006F006E00000031002E0030002E0034003800370037002E003400300039003400380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000C000000803D00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
    WITH PERMISSION_SET = SAFE;
GO
IF @@ERROR <> 0
   AND @@TRANCOUNT > 0
    BEGIN
        ROLLBACK;
    END
IF @@TRANCOUNT = 0
    BEGIN
        INSERT  INTO #tmpErrors (Error)
        VALUES                 (1);
        BEGIN TRANSACTION;
    END
GO
-------------------------------------------------------------------------------------------------------------------
PRINT N'Creating [dbo].[GROUP_CONCAT_DS]...';
GO
CREATE AGGREGATE [dbo].[GROUP_CONCAT_DS](@VALUE NVARCHAR (4000), @DELIMITER NVARCHAR (4), @SORT_ORDER TINYINT)
    RETURNS NVARCHAR (MAX)
    EXTERNAL NAME [GroupConcat].[GroupConcat.GROUP_CONCAT_DS];
GO
IF @@ERROR <> 0
   AND @@TRANCOUNT > 0
    BEGIN
        ROLLBACK;
    END
IF @@TRANCOUNT = 0
    BEGIN
        INSERT  INTO #tmpErrors (Error)
        VALUES                 (1);
        BEGIN TRANSACTION;
    END
GO
-------------------------------------------------------------------------------------------------------------------
IF EXISTS (SELECT * FROM #tmpErrors) ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT>0 BEGIN
PRINT N'The transacted portion of the database update succeeded.'
COMMIT TRANSACTION
END
ELSE PRINT N'The transacted portion of the database update failed.'
GO
DROP TABLE #tmpErrors
