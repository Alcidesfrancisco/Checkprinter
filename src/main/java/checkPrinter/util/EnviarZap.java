package checkPrinter.util;

import com.google.gson.Gson;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

public class EnviarZap {

	private Client c = Client.create();
	private Gson gson = new Gson();
	private String url = "http://localhost:8000/zap-bot-message";
	private String numeroDoZap = "558191159128"; // número de Denisson

	public String enviaNotificacao(String texto) {

		Mensagem mensagem = new Mensagem(numeroDoZap, texto);
		WebResource wr = c.resource(
				url);
		try {
			//System.out.println(gson.toJson(mensagem));
			wr.type("application/json").accept("application/json")
			.post(gson.toJson(mensagem));

			System.out.println(wr.toString());
		} catch (Exception e) {
			return e.getMessage();
		}
		

		return "mensagem enviada com sucesso";
	}

	public static void main(String[] args) {
		EnviarZap ez = new EnviarZap();

		ez.enviaNotificacao("*testando Aqui!!*");
	}
}
