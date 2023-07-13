package checkPrinter.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.internal.StringMap;
import com.google.gson.reflect.TypeToken;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Printer;
import checkPrinter.business.Supplies;
import checkPrinter.business.Supply;

public class JsonHandle {

	public static String arquivoJson = System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json";
	public static void main(String[] args) {


		JsonHandle jh = new JsonHandle();
		try { 

			//jh.EscreverJsonPrinters(jh.carregaGson());
			//jh.carregaJsonPrinters(arquivoJson);
			Supplies supplies = jh.carregaJsonSupplies(System.getProperty("user.dir") + "\\src\\main\\webapp\\supplies.json");
			jh.EscreverJsonSupplies(supplies);
		} catch (IOException | ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	public List<Printer> carregaJsonPrinters(String path) throws IOException, ParseException {

		Gson gson = new Gson();
		TypeToken<HashMap<String,  List<Printer>>> tt = new TypeToken<HashMap<String,  List<Printer>>>() {};
		File file = new File(path);
		InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		BufferedReader reader = new BufferedReader(fileReader);

		String json = reader.readLine();

		JsonElement je = gson.toJsonTree(json);

		HashMap<String, List<Printer>> listPrinters = gson.fromJson(je.getAsString(), tt.getType());
		fileReader.close();
		reader.close();
		return listPrinters.get("Printers");

	}

	public void EscreverJsonPrinters(List<Printer> printers) throws IOException {
	
		FileWriter writeFile = new FileWriter(System.getProperty("user.dir") + 
				"\\src\\main\\webapp\\printers.json");
		Gson gson = new Gson();

		HashMap<String, List<Printer>> map = new HashMap<String, List<Printer>>();
		map.put("Printers", printers);
		writeFile.write(gson.toJson( map));

		writeFile.close();
	}	
	public Supplies carregaJsonSupplies(String path) throws IOException, ParseException {

		Gson gson = new Gson();
		TypeToken<Object> tt = new TypeToken<Object>() {};
		File file = new File(path);
		InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		
		
		StringMap<Object> supplies = gson.fromJson(fileReader, tt.getType());
		
		
		ArrayList<Supply> toners = (ArrayList<Supply>) supplies.get("toners");
		ArrayList<Supply> unidades = (ArrayList<Supply>) supplies.get("unidades");
		ArrayList<Supply> kits = (ArrayList<Supply>) supplies.get("kits");
		Supplies s = new Supplies(toners, unidades, kits);
		
		System.out.println(s);		
		fileReader.close();
		return s;

	}
	public void EscreverJsonSupplies(Supplies supplies) throws IOException {
		
		FileWriter writeFile = new FileWriter(System.getProperty("user.dir") + 
				"\\src\\main\\webapp\\supplies.json");
		Gson gson = new Gson();

		//HashMap<String, List<Printer>> map = new HashMap<String, List<Printer>>();
		//map.put("Printers", printers);
		writeFile.write(gson.toJson( supplies));

		writeFile.close();
	}	
	public Printer getPrinterJson(Printer printer){

		List<Printer> lista;
		try {
			lista = this.carregaJsonPrinters(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json");


			for( Printer p : lista) {
				if(p.getSerial().equals(printer.getSerial())) {
					return p;
				}
			}
		} catch (IOException | ParseException e) {
			System.out.println("Deu erro no GetPrinterJson");
		}

		return printer;
	}


	public List<Printer> carregarTXT(){

		List<Printer> printers = new ArrayList<Printer>(); 
		try {

			File file = new File("/opt/tomcat/webapps/CheckPrinter/printers.txt"); //
			//para Server

			if(!file.exists()) { file = new File(System.getProperty("user.dir") +
					"\\src\\main\\webapp\\printers.txt"); //para localHost }

			InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8"); 
			BufferedReader reader = new BufferedReader(fileReader); String dados = null;

			while((dados = reader.readLine()) != null){ 
				String[] temp = dados.split(" ");
				if(temp[3].contains("MX622") || temp[3].contains("MS622")) { 
					Mx622 mx622 = new Mx622(temp[0], temp[1], temp[2], temp[3], temp[4]); printers.add(mx622);

				}else if(temp[3].contains("MX910")) { 
					Mx910 mx910 = new Mx910(temp[0],temp[1], temp[2], temp[3], temp[4]); printers.add(mx910);

				}else if(temp[3].contains("CX725")) { 
					Cx725 cx725 = new Cx725(temp[0],temp[1], temp[2], temp[3], temp[4]); printers.add(cx725);

				}
			}
			fileReader.close(); reader.close();

			} 

		}catch (Exception e) {
			System.out.println("Erro ao carregar TXT");
		}
		return printers;
	}	 
	
}