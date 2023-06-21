package checkPrinter.util;


import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import org.json.simple.JSONObject;

import checkPrinter.business.Printer;

public class JsonHandle {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) {

		//new JsonHandle().EscreverJsonPrinters(printers);

	}
	public void EscreverJsonPrinters(List<Printer> printers) throws IOException {
		
		List<JSONObject> jList = new ArrayList<>();

		FileWriter writeFile = new FileWriter(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json");
		/*for (Printer printer : printers) {
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("nome", printer.getName());
			jsonObject.put("marca", printer.getMarca());
			jsonObject.put("modelo", printer.getModelo());
			jsonObject.put("serial", printer.getSerial());
			jsonObject.put("url", printer.getUrl());

			
				
				//Escreve no arquivo conteudo do Objeto JSON
				//writeFile.append(jsonObject.toJSONString());
				jList.add(jsonObject);
			
			

			//Imprimne na Tela o Objeto JSON para vizualização
				System.out.println(jsonObject);
		}*/
		Gson gson = new Gson();
		writeFile.write(gson.toJson(printers));
		writeFile.close();


	}

}