package checkPrinter.business;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.List;

public class Mx910 extends Printer implements Runnable{

	public Mx910(String name, String url, String marca, String modelo, String serial) {
		super(name, url, marca, modelo, serial);
	}

	public void run() {

		try {
			//System.out.println(this.getUrl() + "/cgi-bin/dynamic/printer/PrinterStatus.html");
			URL url = new URL(this.getUrl() + "/cgi-bin/dynamic/printer/PrinterStatus.html");



			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setReadTimeout(1000);

			conn.setConnectTimeout(1000);

			BufferedReader in;
			if(conn.getResponseCode() >= 200 && conn.getResponseCode() < 399)
			{

				in = new BufferedReader(new InputStreamReader(url.openStream()));

				String inputLine;

				while ((inputLine = in.readLine()) != null) {

					//TONER
					if(inputLine.contains("Cartucho Preto")){

						if (!inputLine.contains("~")){
							this.setNivelToner(0);
							this.setStatusToner("Cartucho Vazio");
							this.setCssNivelToner("progress-bar progress-bar-danger");

						}else{
							String[] quebra = inputLine.split("~");
							this.setNivelToner(Integer.parseInt(quebra[1].split("%")[0])); //Cartucho preto
							this.setStatusToner("OK");
							this.aplicarCssNivel(this.getNivelToner());
						}
					}
					if(inputLine.contains("cobertura")) {
						String[] quebra = inputLine.split(" ");
						this.setPagRestantesToner(Integer.parseInt(quebra[3].replace(".", "")));
					}
					//UNIDADE
					if (inputLine.contains("Fotocondutor")){
						String[] quebra = inputLine.split("%");
						this.setNivelUnidade(Integer.parseInt(quebra[0].split("</B></TD><TD>")[1]));
						this.aplicarCssNivel(this.getNivelUnidade());
						if(this.getNivelUnidade() > 0) this.setStatusUnidade("OK");
						else this.setStatusUnidade("Vazio");

					}
					//KIT 
					if(inputLine.contains("200K ")){
						String[] quebra = inputLine.split("%");
						
						this.setNivelKit(Integer.parseInt(quebra[0].split("</B></TD><TD>")[1]));
						this.aplicarCssNivel(this.getNivelKit());
						if(this.getNivelKit() > 0) this.setStatuskit("OK");
						else this.setStatusUnidade("Vazio");
					} 
					if (inputLine.contains("statusLine")) {
						String[] quebra = inputLine.split(">");
						
						this.setStatus(quebra[2].split("<")[0]);
						this.aplicarCssStatus(this.getStatus());
					}
				}


			}else{
				throw new IOException();
			}
			in.close();
			this.setStatus("Online");
			this.setCssName("list-group-item list-group-item-success");
			this.setCssNivelToner(aplicarCssNivel(this.getNivelToner()));
			this.setCssNivelKit(aplicarCssNivel(this.getNivelKit()));
			this.setCssUnidade(aplicarCssNivel(this.getNivelUnidade()));
			this.setCssStatusToner(aplicarCssStatus(this.getStatusToner()));
			this.setCssStatusUnidade(aplicarCssStatus(this.getStatusUnidade()));
			this.setCssStatusKit(aplicarCssStatus(this.getStatuskit()));
			this.setCorToner("black");
			this.setCorUnidade("black");
		}catch(SocketTimeoutException e){
			this.setStatus("Offline");
			this.setCssName("list-group-item list-group-item-danger");
		} catch (IOException e) {
			this.setStatus("Offline");
			this.setCssName("list-group-item list-group-item-danger");
		}

	}
}