package checkPrinter.business;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import checkPrinter.util.DateConverter;

public class Supply {
	private String serial;
	private String printer;
	private List<Integer> consumo;
	private List<String> dias;
	private String ultimaData = DateConverter.dateToString(new Date());
	
	
	
	
	public Supply(String serial, String printer, List<Integer> consumo, List<String> dias, String ultimaData) {
		super();
		this.serial = serial;
		this.printer = printer;
		this.consumo = consumo;
		this.dias = dias;
		this.ultimaData = ultimaData;
	}
	public String getUltimaData() {
		return ultimaData;
	}public void setUltimaData(String ultimaData) {
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
	public void setConsumo(List<Integer> consumo) {
		this.consumo = consumo;
	}
	public List<String> getDias() {
		return dias;
	}
	public void setDias(List<String> dias) {
		this.dias = dias;
	}
		
	 @Override
	public String toString() {
		return "Supply [serial=" + serial + ", printer=" + printer + ", consumo=" + consumo + ", dias=" + dias
				+ ", ultimaData=" + ultimaData + "]\n";
	}
	public boolean equals(Object obj) {
	
			return this.serial.equals(((Supply)obj).getSerial());
	
		
	}
	

}
