package checkPrinter.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.parser.ParseException;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Printer;

public class JsonHandle {

	public static String arquivoJson = System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json";
	public static void main(String[] args) {


		JsonHandle jh = new JsonHandle();
		try { 

			//jh.EscreverJsonPrinters(jh.carregaGson());
			jh.carregaJson(arquivoJson);

		} catch (IOException | ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	public List<Printer> carregaJson(String path) throws IOException, ParseException {

		Gson gson = new Gson();
		TypeToken<List<Printer>> tt = new TypeToken<List<Printer>>() {};
		File file = new File(path);
		InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		BufferedReader reader = new BufferedReader(fileReader);

		String json = reader.readLine();

		//System.out.println(new JsonParser().parse(json));
		JsonElement je = gson.toJsonTree(json);

		List<Printer> listPrinters = gson.fromJson(je.getAsString(), tt.getType());
		System.out.println(listPrinters);
		return listPrinters;

	}

	public void EscreverJsonPrinters(List<Printer> printers) throws IOException {
		FileWriter writeFile = new FileWriter(System.getProperty("user.dir") + 
				"\\src\\main\\webapp\\printers.json");
		Gson gson = new Gson();
		writeFile.write(gson.toJson(printers));

		writeFile.close();
	}	
	public List<Printer> carregarTXT(){
	  
	  List<Printer> printers = new ArrayList<Printer>(); 
	  try {
	  
	  File file = new File("/opt/tomcat/webapps/CheckPrinter/printers.txt"); //
	  //para Server
	  
	  if(!file.exists()) { file = new File(System.getProperty("user.dir") +
	  "\\src\\main\\webapp\\printers.txt"); //para localHost }
	  
	  InputStreamReader fileReader = new InputStreamReader(new
	  FileInputStream(file.getPath()), "utf-8"); BufferedReader reader = new
	  BufferedReader(fileReader); String dados = null;
	  
	  while((dados = reader.readLine()) != null){ 
		  String[] temp = dados.split(" ");
	  if(temp[3].contains("MX622") || temp[3].contains("MS622")) { 
		  Mx622 mx622 = new Mx622(temp[0], temp[1], temp[2], temp[3], temp[4]); printers.add(mx622);
	  //System.out.println(mx622);
	  
	  }else if(temp[3].contains("MX910")) { 
		  Mx910 mx910 = new Mx910(temp[0],temp[1], temp[2], temp[3], temp[4]); printers.add(mx910);
	  //System.out.println(mx910);
	  
	  }else if(temp[3].contains("CX725")) { 
		  Cx725 cx725 = new Cx725(temp[0],temp[1], temp[2], temp[3], temp[4]); printers.add(cx725);
	  //System.out.println(cx725); }
	  
	  }
	  }
	  fileReader.close(); reader.close();
	  
	  } 
	  
	  }catch (Exception e) {
		// TODO: handle exception
	}
	  return printers;
	  }	 
}