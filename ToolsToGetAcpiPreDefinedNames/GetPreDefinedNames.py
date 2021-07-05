import requests
from bs4 import BeautifulSoup
from bs4.diagnose import diagnose

class PreDefinedPnpId:
  PnpHtmlTxt = ""
  def __init__(self):
    try:
       with open('PnpId.Html','r') as TxtFo:
          TempPnpHtmlTxt = TxtFo.read()
       TxtFo.close()
       
       soup = BeautifulSoup(TempPnpHtmlTxt, 'lxml')
       if (soup.select("#acpi-device-ids") != None):
         self.PnpHtmlTxt = str(soup.find(['tbody']))
    except:
       print ("File read error with PnpId HTML")
    
  def Test(self):    
      soup = BeautifulSoup(self.PnpHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      IndexValue = 0
      for child in AllTdItem:
        IndexValue = IndexValue + 1
        if ((IndexValue & 0x01) == 0x01): 
            print( " ")
            print(child.text + "  : ") 
        else: 
            print(child.text )

  def PrintPnpId(self):
    try:
      OutStr = ""
      soup = BeautifulSoup(self.PnpHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x00): 
          if ((IndexVal > 0) and ((IndexVal & 0x03) == 0x00)): 
            OutStr = OutStr + '\n'
          OutStr = OutStr + '\"' + AllTdItem[IndexVal].text + '\", ' 
      print (OutStr)
      return OutStr
    except:
      print ("Failed to parse pnp id")
      return None        
  
  def PrintPnpId2(self):
    try:
      OutStr = ""
      soup = BeautifulSoup(self.PnpHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x00): 
          OutStr = OutStr + '|' + AllTdItem[IndexVal].text
      print (OutStr)
      return OutStr
    except:
      print ("Failed to parse pnp id")
      return None  
      
  def PrintPnpIdDesc(self):
    try:
      OutStr = ""
      soup = BeautifulSoup(self.PnpHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x01): 
          OutStr = OutStr + '\"' + AllTdItem[IndexVal].text + '\", \n' 
      print (OutStr)
      return OutStr
    except:
      print ("Failed to parse pnp id")
      return None        
  ''' 
  Get Pnp Device ID
   - class started with .
   - id started with #
  '''
  def GetDeviceIdDesc(self, DescStr:str):
    try:
      
      soup = BeautifulSoup(self.PnpHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x00): 
            if (AllTdItem[IndexVal].text == DescStr):
               #print (AllTdItem[IndexVal + 1].text)
               return AllTdItem[IndexVal + 1].text
    except:
      print ("Failed to parse pnp id")
      return None
      
class PreDefinedName:
  PreNameHtmlTxt = ""
  def __init__(self):
    try:
       with open('PredefinedNames.html','r') as TxtFo:
          PreNameHtmlTxt = TxtFo.read()
       TxtFo.close()
       #print(PreNameHtmlTxt)
       
       soup = BeautifulSoup(PreNameHtmlTxt, 'lxml')
       if (soup.select("#predefined-acpi-names") != None):
         self.PreNameHtmlTxt = str(soup.find(['tbody']))
    except:
       print ("File read error with Predefine Name HTML")

  def PrintPreNames(self):
    try:
      OutStr = ""
      soup = BeautifulSoup(self.PreNameHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x00): 
          if ((IndexVal > 0) and ((IndexVal & 0x07) == 0x00)): 
            OutStr = OutStr + '\n'
          OutStr = OutStr + '\"' + AllTdItem[IndexVal].text + '\", ' 
      print(OutStr)
      return OutStr
    except:
      return None 
  def PrintPreNames2(self):
    try:
      OutStr = ""
      soup = BeautifulSoup(self.PreNameHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x00): 
          OutStr = OutStr + '|' + AllTdItem[IndexVal].text  
      print(OutStr)
      return OutStr
    except:
      return None 
      
  def PrintPreNamesDec(self):
    try:
      OutStr = ""
      soup = BeautifulSoup(self.PreNameHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x01): 
          OutStr = OutStr + '\"' + AllTdItem[IndexVal].text + '\", \n' 
      print(OutStr)
      return OutStr
    except:
      return None   
  ''' 
  Get predefine names
  - class started with .
  - id started with #
  '''
  def GetPreDefineNameDesc(self, DescStr:str):
    try:
      soup = BeautifulSoup(self.PreNameHtmlTxt, 'lxml')
      AllTdItem = soup.find_all(['p'])
      for IndexVal in range(len(AllTdItem)):
        if ((IndexVal & 0x01) == 0x00): 
            if (AllTdItem[IndexVal].text == DescStr):
               #print (AllTdItem[IndexVal + 1].text)
               return AllTdItem[IndexVal + 1].text
    except:
      print ("Failed to parse predefine name")
      return None
 
mPreName = PreDefinedName()
mPrePnpName = PreDefinedPnpId()
print('let PreDefineName: string = [')
mPreName.PrintPreNames()
mPrePnpName.PrintPnpId()
print('];\n');

print('let PreDefNameHelpStr: string = [')
mPreName.PrintPreNamesDec()
mPrePnpName.PrintPnpIdDesc()
print('];\n');

mPreName.PrintPreNames2()
mPrePnpName.PrintPnpId2()





