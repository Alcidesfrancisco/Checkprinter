package checkPrinter.business;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;


public class Supply {
	private String tipo;
	private String serial;
	private String printer;
	private ArrayList<Integer> consumo;
	private ArrayList<Date> dias;
	private Date ultimaData =new Date();
	
	
	
	
	public Supply(String serial, 
					String printer, 
					String tipo, 
					ArrayList<Integer> consumo, 
					ArrayList<Date> dias, 
					Date ultimaData) {
		super();
		this.serial = serial;
		this.printer = printer;
		this.consumo = consumo;
		this.dias = dias;
		this.ultimaData = ultimaData;
		this.tipo = tipo;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Date getUltimaData() {
		return ultimaData;
	}public void setUltimaData(Date ultimaData) {
		this.ultimaData = ultimaData;
	}
	public String getSerial() {
		return serial;
	}
	public void setSerial(String serial) {
		this.serial = serial;
	}
	public String getPrinter() {
		return printer;
	}
	public void setPrinter(String printer) {
		this.printer = printer;
	}
	public List<Integer> getConsumo() {
		return consumo;
	}
	public void setConsumo(ArrayList<Integer> consumo) {
		this.consumo = consumo;
	}
	public List<Date> getDias() {
		return dias;
	}
	public void setDias(ArrayList<Date> dias) {
		this.dias = dias;
	}
		
	 @Override
	public String toString() {
		return "Supply [serial=" + serial + ", printer=" + printer + ", consumo=" + consumo + ", dias=" + dias
				+ ", ultimaData=" + ultimaData + "]" + " Tipo= "+ tipo + "\n";
	}
	@Override
	public int hashCode() {
		return Objects.hash(consumo, dias, printer, serial, tipo, ultimaData);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Supply other = (Supply) obj;
		
		return Objects.equals(serial, other.serial);
	}

	

}
