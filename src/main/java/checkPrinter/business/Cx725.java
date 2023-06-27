package checkPrinter.business;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Cx725 extends Printer implements Runnable{
	
	private Integer nivelUnidadeCMY;
	private String CssUnidadeCMY;
	private String statusUnidadeCMY;
	private String corUnidadeCMY;
	private Integer pagRestantesUnidadeCMY;
	private String CssNivelUnidadeCMY;
	private String serialUnidadeCMY;
	
	private Integer nivelTonerCyan;
	private String cssNivelTonerCyan;
	private String cssStatusTonerCyan;
	private Integer pagRestantesTonerCyan;
	private String statusTonerCyan;
	private String corTonerCyan;
	private String serialTonerCyan;
	
	private Integer nivelTonerMagenta;
	private String cssNiveltonerMagenta;
	private String cssStatusTonerMagenta;
	private Integer pagRestantesTonerMagenta;
	private String statusTonerMagenta;
	private String corTonerMagenta;
	private String serialTonerMagenta;
	
	private Integer nivelTonerYellow;
	private String cssNiveltonerYellow;
	private String cssStatusTonerYellow;
	private Integer pagRestantesTonerYellow;
	private String statusTonerYellow;
	private String corTonerYellow;
	private String serialTonerYellow;
	
	public Cx725(String name, String url, String marca, String modelo, String serial) {
		super(name, url, marca, modelo, serial);
	}
	
	public Integer getNivelUnidadeCMY() {
		return nivelUnidadeCMY;
	}

	public String getCssUnidadeCMY() {
		return CssUnidadeCMY;
	}

	public String getStatusUnidadeCMY() {
		return statusUnidadeCMY;
	}

	public String getCorUnidadeCMY() {
		return corUnidadeCMY;
	}

	public Integer getPagRestantesUnidadeCMY() {
		return pagRestantesUnidadeCMY;
	}

	public void setNivelUnidadeCMY(Integer nivelUnidadeCMY) {
		this.nivelUnidadeCMY = nivelUnidadeCMY;
	}

	public void setCssUnidadeCMY(String cssUnidadeCMY) {
		CssUnidadeCMY = cssUnidadeCMY;
	}

	public void setStatusUnidadeCMY(String statusUnidadeCMY) {
		this.statusUnidadeCMY = statusUnidadeCMY;
	}

	public void setCorUnidadeCMY(String corUnidadeCMY) {
		this.corUnidadeCMY = corUnidadeCMY;
	}

	public void setPagRestantesUnidadeCMY(Integer pagRestantesUnidadeCMY) {
		this.pagRestantesUnidadeCMY = pagRestantesUnidadeCMY;
	}
	

	public String getCssNivelUnidadeCMY() {
		return CssNivelUnidadeCMY;
	}

	public void setCssNivelUnidadeCMY(String cssNivelUnidadeCMY) {
		CssNivelUnidadeCMY = cssNivelUnidadeCMY;
	}

	public Integer getNivelTonerCyan() {
		return nivelTonerCyan;
	}

	public String getCssNivelTonerCyan() {
		return cssNivelTonerCyan;
	}

	public String getCssStatusTonerCyan() {
		return cssStatusTonerCyan;
	}

	public Integer getPagRestantesTonerCyan() {
		return pagRestantesTonerCyan;
	}

	public String getStatusTonerCyan() {
		return statusTonerCyan;
	}

	public String getCorTonerCyan() {
		return corTonerCyan;
	}

	public Integer getNivelTonerMagenta() {
		return nivelTonerMagenta;
	}

	public String getCssNiveltonerMagenta() {
		return cssNiveltonerMagenta;
	}

	public String getCssStatusTonerMagenta() {
		return cssStatusTonerMagenta;
	}

	public Integer getPagRestantesTonerMagenta() {
		return pagRestantesTonerMagenta;
	}

	public String getStatusTonerMagenta() {
		return statusTonerMagenta;
	}

	public String getCorTonerMagenta() {
		return corTonerMagenta;
	}

	public Integer getNivelTonerYellow() {
		return nivelTonerYellow;
	}

	public String getCssNiveltonerYellow() {
		return cssNiveltonerYellow;
	}

	public String getCssStatusTonerYellow() {
		return cssStatusTonerYellow;
	}

	public Integer getPagRestantesTonerYellow() {
		return pagRestantesTonerYellow;
	}

	public String getStatusTonerYellow() {
		return statusTonerYellow;
	}

	public String getCorTonerYellow() {
		return corTonerYellow;
	}

	public void setNivelTonerCyan(Integer nivelTonerCyan) {
		this.nivelTonerCyan = nivelTonerCyan;
	}

	public void setCssNivelTonerCyan(String cssNiveltonerCyan) {
		this.cssNivelTonerCyan = cssNiveltonerCyan;
	}

	public void setCssStatusTonerCyan(String cssStatusTonerCyan) {
		this.cssStatusTonerCyan = cssStatusTonerCyan;
	}

	public void setPagRestantesTonerCyan(Integer pagRestantesTonerCyan) {
		this.pagRestantesTonerCyan = pagRestantesTonerCyan;
	}

	public void setStatusTonerCyan(String statusTonerCyan) {
		this.statusTonerCyan = statusTonerCyan;
	}

	public void setCorTonerCyan(String corTonerCyan) {
		this.corTonerCyan = corTonerCyan;
	}

	public void setNivelTonerMagenta(Integer nivelTonerMagenta) {
		this.nivelTonerMagenta = nivelTonerMagenta;
	}

	public void setCssNiveltonerMagenta(String cssNiveltonerMagenta) {
		this.cssNiveltonerMagenta = cssNiveltonerMagenta;
	}

	public void setCssStatusTonerMagenta(String cssStatusTonerMagenta) {
		this.cssStatusTonerMagenta = cssStatusTonerMagenta;
	}

	public void setPagRestantesTonerMagenta(Integer pagRestantesTonerMagenta) {
		this.pagRestantesTonerMagenta = pagRestantesTonerMagenta;
	}

	public void setStatusTonerMagenta(String statusTonerMagenta) {
		this.statusTonerMagenta = statusTonerMagenta;
	}

	public void setCorTonerMagenta(String corTonerMagenta) {
		this.corTonerMagenta = corTonerMagenta;
	}

	public void setNivelTonerYellow(Integer nivelTonerYellow) {
		this.nivelTonerYellow = nivelTonerYellow;
	}

	public void setCssNiveltonerYellow(String cssNiveltonerYellow) {
		this.cssNiveltonerYellow = cssNiveltonerYellow;
	}

	public void setCssStatusTonerYellow(String cssStatusTonerYellow) {
		this.cssStatusTonerYellow = cssStatusTonerYellow;
	}

	public void setPagRestantesTonerYellow(Integer pagRestantesTonerYellow) {
		this.pagRestantesTonerYellow = pagRestantesTonerYellow;
	}

	public void setStatusTonerYellow(String statusTonerYellow) {
		this.statusTonerYellow = statusTonerYellow;
	}

	public void setCorTonerYellow(String corTonerYellow) {
		this.corTonerYellow = corTonerYellow;
	}

	public String getSerialUnidadeCMY() {
		return serialUnidadeCMY;
	}

	public String getSerialTonerCyan() {
		return serialTonerCyan;
	}

	public String getSerialTonerMagenta() {
		return serialTonerMagenta;
	}

	public String getSerialTonerYellow() {
		return serialTonerYellow;
	}

	public void setSerialUnidadeCMY(String serialUnidadeCMY) {
		this.serialUnidadeCMY = serialUnidadeCMY;
	}

	public void setSerialTonerCyan(String serialTonerCyan) {
		this.serialTonerCyan = serialTonerCyan;
	}

	public void setSerialTonerMagenta(String serialTonerMagenta) {
		this.serialTonerMagenta = serialTonerMagenta;
	}

	public void setSerialTonerYellow(String serialTonerYellow) {
		this.serialTonerYellow = serialTonerYellow;
	}

	public void run() {

		 //Printer printer = new Printer("NATI", "http://150.161.80.20", "84sd6f68sd4f68");

		 try {

			 URL url = new URL(this.getUrl() + "/webglue/rawcontent?timedRefresh=1&c=Status&lang=en");
			 //System.out.println("URL");

			 JSONParser parser = new JSONParser();
			 HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			 conn.setReadTimeout(1000);

			 conn.setConnectTimeout(1000);

			 BufferedReader in;
			 if(conn.getResponseCode() >= 200 && conn.getResponseCode() < 399)
			 {

				 in = new BufferedReader(new InputStreamReader(url.openStream()));
				 JSONObject jsonObject = (JSONObject) parser.parse(in);
				 HashMap<String, Object> obj = (HashMap<String, Object >) jsonObject.get("nodes");
				 HashMap<String, Object> supplies = ((HashMap<String, Object>)obj.get("supplies"));

				 HashMap<String, Object> toner = (HashMap<String, Object>)supplies.get("Black Toner");
				 this.setNivelToner(Integer.parseInt(toner.get("curlevel").toString()));
				 this.setCorToner((String)toner.get("color"));
				 this.setStatusToner(toner.get("currentStatus").toString());
				 this.setPagRestantesToner(Integer.parseInt(toner.get("pagesRemaining").toString()));
				 this.setSerialToner(toner.get("serialNumber").toString());
				 
				 HashMap<String, Object> tonerCyan = (HashMap<String, Object>)supplies.get("Cyan Toner");
				 this.setNivelTonerCyan(Integer.parseInt(tonerCyan.get("curlevel").toString()));
				 this.setCorTonerCyan((String)tonerCyan.get("color"));
				 this.setStatusTonerCyan(tonerCyan.get("currentStatus").toString());
				 this.setPagRestantesTonerCyan(Integer.parseInt(tonerCyan.get("pagesRemaining").toString()));
				 this.setCssNivelTonerCyan(aplicarCssNivel(this.getNivelTonerCyan()));
				 this.setCssStatusTonerCyan(aplicarCssStatus(this.getStatusTonerCyan()));
				 this.setSerialTonerCyan(tonerCyan.get("serialNumber").toString());
				 
				 HashMap<String, Object> tonerYellow = (HashMap<String, Object>)supplies.get("Yellow Toner");
				 this.setNivelTonerYellow(Integer.parseInt(tonerYellow.get("curlevel").toString()));
				 this.setCorTonerYellow((String)tonerYellow.get("color"));
				 this.setStatusTonerYellow(tonerYellow.get("currentStatus").toString());
				 this.setPagRestantesTonerYellow(Integer.parseInt(tonerYellow.get("pagesRemaining").toString()));
				 this.setCssNiveltonerYellow(aplicarCssNivel(this.getNivelTonerYellow()));
				 this.setCssStatusTonerYellow(aplicarCssStatus(this.getStatusTonerYellow()));
				 this.setSerialTonerYellow(tonerYellow.get("serialNumber").toString());
				 
				 HashMap<String, Object> tonerMagenta = (HashMap<String, Object>)supplies.get("Magenta Toner");
				 this.setNivelTonerMagenta(Integer.parseInt(tonerMagenta.get("curlevel").toString()));
				 this.setCorTonerMagenta((String)tonerMagenta.get("color"));
				 this.setStatusTonerMagenta(tonerMagenta.get("currentStatus").toString());
				 this.setPagRestantesTonerMagenta(Integer.parseInt(tonerMagenta.get("pagesRemaining").toString()));
				 this.setCssNiveltonerMagenta(aplicarCssNivel(this.getNivelTonerMagenta()));
				 this.setCssStatusTonerMagenta(aplicarCssStatus(this.getStatusTonerMagenta()));
				 this.setSerialTonerMagenta(tonerMagenta.get("serialNumber").toString());

				 HashMap<String, Object> unidade = (HashMap<String, Object>)supplies.get("Black Imaging Kit");
				 this.setNivelUnidade(Integer.parseInt(unidade.get("curlevel").toString()));
				 this.setCorUnidade((String)unidade.get("color"));
				 this.setStatusUnidade(unidade.get("currentStatus").toString());
				 this.setPagRestantesUnidade(Integer.parseInt(unidade.get("pagesRemaining").toString()));
				 this.setSerialUnidade(unidade.get("serialNumber").toString());

				 HashMap<String, Object> cmy = (HashMap<String, Object>)supplies.get("CMY Imaging Kit");
				 this.setNivelUnidadeCMY(Integer.parseInt(cmy.get("curlevel").toString()));
				 this.setStatusUnidadeCMY(cmy.get("currentStatus").toString());
				 this.setPagRestantesUnidadeCMY(Integer.parseInt(cmy.get("pagesRemaining").toString()));
				 this.setCorUnidadeCMY("Color");
				 this.setSerialUnidadeCMY(cmy.get("serialNumber").toString());
				 
			 }else {
				 throw new IOException();
			 }
			 
			 this.setCssNivelToner(aplicarCssNivel(this.getNivelToner()));
			 this.setCssUnidadeCMY(aplicarCssNivel(this.getNivelUnidadeCMY()));
			 this.setCssNivelUnidadeCMY(aplicarCssNivel(this.getNivelUnidadeCMY()));
			 this.setCssUnidade(aplicarCssNivel(this.getNivelUnidade()));
			 this.setCssStatusToner(aplicarCssStatus(this.getStatusToner()));
			 this.setCssStatusUnidade(aplicarCssStatus(this.getStatusUnidade()));
			 this.setCssStatusKit(aplicarCssStatus(this.getStatuskit()));
			 this.setCssName("list-group-item list-group-item-success");
			 this.setStatus("Online");
		 }catch(SocketTimeoutException e){
			 this.setStatus("Offline");
			 this.setCssName("list-group-item list-group-item-danger");
		 } catch (IOException e) {
			 this.setStatus("Offline");
			 this.setCssName("list-group-item list-group-item-danger");
		 } catch (ParseException e) {
			 this.setStatus("Offline");
			 this.setCssName("list-group-item list-group-item-danger");
		 }
	 }

	@Override
	public String toString() {
		return "Cx725 [nivelUnidadeCMY=" + nivelUnidadeCMY + ", CssUnidadeCMY=" + CssUnidadeCMY + ", statusUnidadeCMY="
				+ statusUnidadeCMY + ", corUnidadeCMY=" + corUnidadeCMY + ", pagRestantesUnidadeCMY="
				+ pagRestantesUnidadeCMY + ", CssNivelUnidadeCMY=" + CssNivelUnidadeCMY + "]";
	}
	
}
