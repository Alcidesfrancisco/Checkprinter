package checkPrinter.business;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import checkPrinter.util.JsonHandle;

public class Mx622 extends Printer implements Runnable{

	public Mx622(String name, String url, String marca, String modelo, String serial) {
		super(name, url, marca, modelo, serial);
	}

	public void run() {

		try {

			URL url = new URL(this.getUrl() + "/webglue/rawcontent?timedRefresh=1&c=Status&lang=en");
			if(this.getName().equals("NATI")) System.out.println(this);
			JSONParser parser = new JSONParser();
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setReadTimeout(1000);
			conn.setConnectTimeout(1000);
			
			if(conn.getResponseCode() >= 200 && conn.getResponseCode() < 399)
			{

				BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
				JSONObject jsonObject = (JSONObject) parser.parse(in);
				HashMap<String, Object> obj = (HashMap<String, Object >) jsonObject.get("nodes");
				HashMap<String, Object> supplies = ((HashMap<String, Object>)obj.get("supplies"));

				HashMap<String, Object> toner = (HashMap<String, Object>)supplies.get("Black Toner");
				this.setNivelToner(Integer.parseInt(toner.get("curlevel").toString()));
				this.setCorToner((String)toner.get("color"));
				this.setStatusToner(toner.get("currentStatus").toString());
				this.setPagRestantesToner(Integer.parseInt(toner.get("pagesRemaining").toString()));
				this.setSerialToner(toner.get("serialNumber").toString());

				HashMap<String, Object> unidade = (HashMap<String, Object>)supplies.get("Black Imaging Kit");
				this.setNivelUnidade(Integer.parseInt(unidade.get("curlevel").toString()));
				this.setCorUnidade((String)unidade.get("color"));
				this.setStatusUnidade(unidade.get("currentStatus").toString());
				this.setPagRestantesUnidade(Integer.parseInt(unidade.get("pagesRemaining").toString()));
				this.setSerialUnidade(unidade.get("serialNumber").toString());

				HashMap<String, Object> kit = (HashMap<String, Object>)supplies.get("Maintenance Kit");
				this.setNivelKit(Integer.parseInt(kit.get("curlevel").toString()));
				this.setStatuskit(kit.get("currentStatus").toString());
				this.setPagRestantesKit(Integer.parseInt(kit.get("pagesRemaining").toString()));
				this.setSerialKit(kit.get("serialNumber").toString());
				this.setStatus("Online");
			}else {
				
				this.setStatus("Offline");
				this.setCssName("list-group-item list-group-item-danger");
			}
			
			
			//loadHTML(this);
			aplicarCss();
			this.setEstatisticasPrinter();
		}catch(IOException | ParseException e){
			
			this.setStatus("Offline");
			this.setCssName("list-group-item list-group-item-danger");
			if(this.getName().equals("NATI")) System.out.println(this);
			
		} 
	}

	public void aplicarCss() {
		try {
			
			  this.setCssNivelToner(aplicarCssNivel(this.getNivelToner()));
			  this.setCssNivelKit(aplicarCssNivel(this.getNivelKit()));
			  this.setCssUnidade(aplicarCssNivel(this.getNivelUnidade()));
			  this.setCssStatusToner(aplicarCssStatus(this.getStatusToner()));
			  this.setCssStatusUnidade(aplicarCssStatus(this.getStatusUnidade()));
			  this.setCssStatusKit(aplicarCssStatus(this.getStatuskit()));
			 
			this.setCssName("list-group-item list-group-item-success");
			
			if(this.getStatus() != null) this.setStatus("Online");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
