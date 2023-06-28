package checkPrinter.business;

import java.util.Date;

public class Ocorrencia {
	
	
	private String printerSerial;
	private String mensagem;
	private String tipo;
	private Date timeStamp;
	private String status;
	
	
	
	public Ocorrencia(String printerSerial,String mensagem, String tipo, Date timeStamp) {
		super();
		this.printerSerial = printerSerial;

		this.mensagem = mensagem;
		this.tipo = tipo;
		this.timeStamp = timeStamp;
		this.status = "Em Aberto"; 
		
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPrinterSerial() {
		return printerSerial;
	}
	public void setPrinterSerial(String printerSerial) {
		this.printerSerial = printerSerial;
	}
	public String getMensagem() {
		return mensagem;
	}
	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}
	public String getTipo() {
		return this.tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Date getTimeStamp() {
		return timeStamp;
	}
	public void setTimeStamp(Date timeStamp) {
		this.timeStamp = timeStamp;
	}
	
	@Override
	public String toString() {
		return "Ocorrencia [printerSerial=" + printerSerial + ", mensagem=" + mensagem + ", tipo=" + tipo
				+ ", timeStamp=" + timeStamp + ", status=" + status + "]";
	}
	
	
	

}
