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
       #print(TempPnpHtmlTxt)
       
       soup = BeautifulSoup(TempPnpHtmlTxt, 'lxml')
       if (soup.select("#acpi-device-ids") != None):
         self.PnpHtmlTxt = str(soup.find(['tbody']))
    except:
       print ("File read error with PnpId HTML")
    '''
    try:
       with open('PnpId.Html','r') as TxtFo:
          self.PnpHtmlTxt = TxtFo.read()
       TxtFo.close()
       soup = BeautifulSoup(self.PnpHtmlTxt, 'html.parser')
       if (soup.find("#acpi-device-ids") != None):
         self.PnpHtmlTxt = soup.find("#acpi-device-ids").string
       print(self.PnpHtmlTxt)
    except:
       print ("File read error with PnpId HTML")
    '''
    
  
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
          OutStr = OutStr + '\"' + AllTdItem[IndexVal].text + '\", ' 
          if ((IndexVal & 0x07) == 0x00):
             OutStr = OutStr + '\n'
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
 
mPnpId = PreDefinedPnpId()
#mPnpId.GetDeviceIdDesc('PNP0C0F')
mPnpId.PrintPnpId()

