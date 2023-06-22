package checkPrinter.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Printer;

public class JsonHandle {

	
	public static void main(String[] args) {

		JsonHandle jh = new JsonHandle();
		try {
			jh.EscreverJsonPrinters(jh.carregarTXT());
			jh.carregaGson();
		} catch (IOException | ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	public void carregaGson() throws IOException, ParseException {
		JSONParser parser = new JSONParser();
		Gson gson = new Gson();
		TypeToken tt = new TypeToken<List<Printer>>() {
	    };
		File file = new File(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json");
		InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		BufferedReader reader = new BufferedReader(fileReader);
		String json = reader.readLine();
		
		 
		
		System.out.println(new JsonParser().parse(json));
		JsonElement je = gson.toJsonTree(json);
		System.out.println(je);
		
		    
		String str = "[\n"
	            + "  {\n"
	            + "    \"name\": \"Guilherme Biff Zarelli\",\n"
	            + "    \"marca\":\"M\",\n"
	            + "    \"serial\": 26\n"
	            + "  },\n"
	            + "    {\n"
	            + "    \"name\": \"Joao Silveira\",\n"
	            + "    \"marca\":\"M\",\n"
	            + "    \"serial\": 45\n"
	            + "  },\n"
	            + "    {\n"
	            + "    \"name\": \"Maria Oliveira\",\n"
	            + "    \"marca\":\"F\",\n"
	            + "    \"serial\": 22\n"
	            + "  }\n"
	            + "]";
		 
		 //Define o TypeToken para a conversão string->objeto
		    
		 
		    //Biblioteca Gson: https://github.com/google/gson
		    
		    //Conversao json para List<Usuario>
		    List<Printer> fromJson = gson.fromJson(je.getAsString(), tt.getType());
		 
		    System.out.println(fromJson);
	}
	
	public void EscreverJsonPrinters(List<Printer> printers) throws IOException {
		FileWriter writeFile = new FileWriter(System.getProperty("user.dir") + 
				"\\src\\main\\webapp\\printers.json");
		HashMap<String, Printer> obj = new HashMap<String, Printer>();
		
		
		Gson gson = new Gson();
		writeFile.write(gson.toJson(printers));
		
		writeFile.close();
	}
	public void carregaJson() throws IOException, ParseException {
		JSONParser parser = new JSONParser();
		File file = new File(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json");
		InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		JSONObject jsonObject = (JSONObject) parser.parse(fileReader);
		
		List<ArrayList<Printer>> map = (List<ArrayList<Printer>>) jsonObject.get("printers");
		System.out.println( jsonObject.get("printers"));
		System.out.println("///");
		List<Object> data = (List<Object>) new Gson().fromJson(jsonObject.toJSONString(), Object.class);
		System.out.println(data);
		System.out.println("----");
		for (Object object : map.get(0)) {
			System.out.println(object);
		}
		
		//System.out.println(map);
	}

public List<Printer> carregarTXT(){
	List<Printer> printers = new ArrayList<Printer>();
	try {

		File file = new File("/opt/tomcat/webapps/CheckPrinter/printers.txt"); // para Server

		if(!file.exists()) {
			file = new File(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.txt"); //para localHost
		}

		InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		BufferedReader reader = new BufferedReader(fileReader);
		String dados = null;
		
		while((dados = reader.readLine()) != null){
			String[] temp = dados.split(" ");
			if(temp[3].contains("MX622") || temp[3].contains("MS622")) {
				Mx622 mx622 = new Mx622(temp[0], temp[1], temp[2], temp[3], temp[4]);				
				printers.add(mx622);				
				//System.out.println(mx622);
				
			}else if(temp[3].contains("MX910")) {
				Mx910 mx910 = new Mx910(temp[0], temp[1], temp[2], temp[3], temp[4]);
				printers.add(mx910);				
				//System.out.println(mx910);
				
			}else if(temp[3].contains("CX725")) {
				Cx725 cx725 = new Cx725(temp[0], temp[1], temp[2], temp[3], temp[4]);
				printers.add(cx725);
				//System.out.println(cx725);
			}
			
		}
		fileReader.close();
		reader.close();
		
		
	} catch (IOException e) {
		
		e.printStackTrace();
	}
	System.out.println(printers);
	return printers;
}

}