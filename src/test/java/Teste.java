import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Printer;

public class Teste {



	public static void main(String[] args) throws Throwable {


		//Arquivo json
		String json = new Teste().carregarTXT();

		//Define o TypeToken para a conversão string->objeto
		TypeToken tt = new TypeToken<List<Printer>>() {
		};

		//Biblioteca Gson: https://github.com/google/gson
		Gson gson = new Gson();
		//Conversao json para List<Usuario>
		List<Printer> fromJson = gson.fromJson(json, tt.getType());

		System.out.println(fromJson);
	}

	/**
	 * Objeto utilizado para mapear o json
	 */


	public String carregarTXT() throws IOException{
		List<Printer> printers = new ArrayList<Printer>();



		InputStreamReader fileReader = null;

		File file = new File(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json"); //para localHost



		try {
			fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		BufferedReader reader = new BufferedReader(fileReader);
		String dados = null;
System.out.println(reader.lines());
		while((dados = reader.readLine()) != null){
			dados += dados;
		}
		System.out.println(dados);
		return dados;

	}


}
