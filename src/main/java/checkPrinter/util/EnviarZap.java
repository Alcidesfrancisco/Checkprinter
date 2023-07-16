package checkPrinter.util;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

import checkPrinter.business.Printer;

public class EnviarZap {

	private Client c = Client.create();
	private Gson gson = new Gson();
	private String url = "http://localhost:8000/zap-bot-message";
	private String numeroDoZap = "558197143365"; 
	private String tipoMensagem = "toner";

	public String enviaNotificacao(String texto) {

		Mensagem mensagem = new Mensagem(numeroDoZap, texto);
		WebResource wr = c.resource(
				url);
		
		try {
			//System.out.println(gson.toJson(mensagem));
			
			wr.type("application/json").accept("application/json")
			.header("tipo_mensagem", tipoMensagem)
			.post(gson.toJson(mensagem));
			//wr.setProperty("propied", "testandoooo");
			
		
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		

		return "mensagem enviada com sucesso";
	}
	public String enviaPrinter(Printer printer) {

		
		WebResource wr = c.resource(
				"http://localhost:8000/zap-bot-printer");
		
		try {
			//System.out.println(gson.toJson(mensagem));
			
			wr.type("application/json").accept("application/json")
			.header("tipo_mensagem", "printer")
			.post(gson.toJson(printer));
			//wr.setProperty("propied", "testandoooo");
			
		
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		

		return "mensagem enviada com sucesso";
	}
	
	
	public List<Mensagem> getMemsagensAPI(){
		List<Mensagem> lista = new ArrayList<Mensagem>();
		WebResource wr = c.resource(
				"http://localhost:8000/zap-bot-get_messages");
		try {
			//System.out.println(gson.toJson(mensagem));
			
			String ret = wr.type("application/json").accept("application/json").get(String.class);
			
			//wr.setProperty("propied", "testandoooo");
			
		System.out.println(gson.toJson(ret));
		
		
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
		
		
		return lista;
	}

	public static void main(String[] args) {
		EnviarZap ez = new EnviarZap();
		

		ez.enviaNotificacao("*testando Aqui!!*");
	}
}
