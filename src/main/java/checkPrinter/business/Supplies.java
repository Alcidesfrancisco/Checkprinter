package checkPrinter.business;

import java.util.ArrayList;

public class Supplies {
	private ArrayList<Supply> toners;
	private ArrayList<Supply> unidades;
	private ArrayList<Supply> kits;
	
	public Supplies(ArrayList<Supply> toners, ArrayList<Supply> unidades, ArrayList<Supply> kits) {
		super();
		this.toners = toners;
		this.unidades = unidades;
		this.kits = kits;
	}
	
	
	@Override
	public String toString() {
		return "Supplies [toners=" + toners + ", unidades=" + unidades + ", kits=" + kits + "]";
	}

	public ArrayList<Supply> getToners() {
		return toners;
	}


	public void setToners(ArrayList<Supply> toners) {
		this.toners = toners;
	}


	public ArrayList<Supply> getUnidades() {
		return unidades;
	}


	public void setUnidades(ArrayList<Supply> unidades) {
		this.unidades = unidades;
	}


	public ArrayList<Supply> getKits() {
		return kits;
	}


	public void setKits(ArrayList<Supply> kits) {
		this.kits = kits;
	}



	
	
	

	
	
}
