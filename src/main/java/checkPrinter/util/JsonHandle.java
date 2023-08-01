package checkPrinter.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Printer;
import checkPrinter.business.Supply;

public class JsonHandle {

	private static final String ARQUIVO_TXT_PRINTERS_JSON = System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.txt";
	private static final String ARQUIVO_SUPPLIES_JSON = System.getProperty("user.dir") + "\\src\\main\\webapp\\logSupplies.json";
	private static final String ARQUIVO_PRINTERS_JSON = System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json";
	
	
	public static void main(String[] args) {


		JsonHandle jh = new JsonHandle();
		try { 

			//jh.EscreverJsonPrinters(jh.carregaGson());
			//jh.carregaJsonPrinters(arquivoJson);
			//Supplies supplies = jh.carregaJsonSupplies();
			//System.out.println(supplies.getToners().get(0));
			//jh.EscreverJsonSupplies(supplies);
			jh.carregaJsonSupplies();
		} catch (IOException | ParseException e) {
			e.printStackTrace();
		}

	}
	public List<Printer> carregaJsonPrinters() throws IOException, ParseException {

		Gson gson = new Gson();
		TypeToken<HashMap<String,  List<Printer>>> tt = new TypeToken<HashMap<String,  List<Printer>>>() {};
		File file = new File(ARQUIVO_PRINTERS_JSON);
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
	
		FileWriter writeFile = new FileWriter(ARQUIVO_PRINTERS_JSON);
		Gson gson = new Gson();

		HashMap<String, List<Printer>> map = new HashMap<String, List<Printer>>();
		map.put("Printers", printers);
		writeFile.write(gson.toJson( map));

		writeFile.close();
	}	
	@SuppressWarnings("unchecked")
	public ArrayList<Supply> carregaJsonSupplies() throws IOException, ParseException {

		JSONArray jsonArray;
		Gson gson = new Gson();
		
		ArrayList<Supply> supplies = new ArrayList<Supply>();
		JSONParser parser = new JSONParser();
		File file = new File(ARQUIVO_SUPPLIES_JSON);
		FileReader fileReader;
		if(file.exists()){
			fileReader = new FileReader(ARQUIVO_SUPPLIES_JSON);
			jsonArray = (JSONArray) parser.parse(fileReader);
		}else{
			return supplies;
		}
		TypeToken<ArrayList<Supply>> tt = new TypeToken<ArrayList<Supply>>() {};
		JsonElement je = gson.toJsonTree(jsonArray.toJSONString());
		supplies = gson.fromJson(je.getAsString(), tt.getType());
		
		fileReader.close();
		return supplies;
		

	}
	public void EscreverJsonSupplies(ArrayList<Supply> supplies) throws IOException {
		
		FileWriter writeFile = new FileWriter(ARQUIVO_SUPPLIES_JSON, false);
		Gson gson = new Gson();

		writeFile.write(gson.toJson(supplies));

		writeFile.close();
	}	
	public Printer getPrinterJson(Printer printer){

		List<Printer> lista;
		try {
			lista = this.carregaJsonPrinters();


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

			File file = new File("/opt/tomcat/webapps/CheckPrinter/printers.txt"); //para Server

			if(!file.exists()) { file = new File(ARQUIVO_TXT_PRINTERS_JSON); //para localHost

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