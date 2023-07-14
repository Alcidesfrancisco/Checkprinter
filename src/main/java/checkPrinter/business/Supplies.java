package checkPrinter.business;

import java.util.ArrayList;

public class Supplies {
	private ArrayList<Supply> toners;
	private ArrayList<Supply> unidades;
	private ArrayList<Supply> kits;
	
	public Supplies() {
		super();
		this.toners = new ArrayList<Supply>();
		this.unidades = new ArrayList<Supply>();
		this.kits = new ArrayList<Supply>();
	}
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
	
	
	
	public void addToner(Supply toner) {
		this.toners.add(toner);
	}
	public void addUnidade(Supply unidade) {
		this.unidades.add(unidade);
	}
	public void addKit(Supply kit) {
		this.kits.add(kit);
	}


	
	
	

	
	
}
