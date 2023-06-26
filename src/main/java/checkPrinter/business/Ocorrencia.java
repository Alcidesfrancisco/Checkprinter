package checkPrinter.business;

import java.util.Date;

public class Ocorrencia {
	
	
	private String printerSerial;
	private Integer id;
	private String mensagem;
	private String tipo;
	private Date timeStamp;
	private String status;
	
	
	
	public Ocorrencia(String printerSerial, Integer id, String mensagem, String tipo, Date timeStamp) {
		super();
		this.printerSerial = printerSerial;
		this.id = id;
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
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
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
		return "Ocorrencia [printerSerial=" + printerSerial + ", id=" + id + ", mensagem=" + mensagem + ", tipo=" + tipo
				+ ", timeStamp=" + timeStamp + ", status=" + status + "]";
	}
	
	
	

}
