package checkPrinter.business;

import java.util.Arrays;
import java.util.Date;

public class Supply {
	private String serial;
	private String printer;
	private Integer[] consumo;
	private String[] dias;
	
	
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
	public Integer[] getConsumo() {
		return consumo;
	}
	public void setConsumo(Integer[] consumo) {
		this.consumo = consumo;
	}
	public String[] getDias() {
		return dias;
	}
	public void setDias(String[] dias) {
		this.dias = dias;
	}
	@Override
	public String toString() {
		return "Supply [serial=" + serial + ", printer=" + printer + ", consumo=" + Arrays.toString(consumo) + ", dias="
				+ Arrays.toString(dias) + "]";
	}
	 
	

}
