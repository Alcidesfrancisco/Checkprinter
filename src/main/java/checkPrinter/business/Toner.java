package checkPrinter.business;

public class Toner {
	private Integer nivelToner;
	private String statusToner;
	private String corToner;
	private String serialToner;
	private Integer pagRestantesToner;

	public Toner() {
	}

	public Integer getNivelToner() {
		return nivelToner;
	}

	public void setNivelToner(Integer nivelToner) {
		this.nivelToner = nivelToner;
	}

	public String getStatusToner() {
		return statusToner;
	}

	public void setStatusToner(String statusToner) {
		this.statusToner = statusToner;
	}

	public String getCorToner() {
		return corToner;
	}

	public void setCorToner(String corToner) {
		this.corToner = corToner;
	}

	public String getSerialToner() {
		return serialToner;
	}

	public void setSerialToner(String serialToner) {
		this.serialToner = serialToner;
	}

	public Integer getPagRestantesToner() {
		return pagRestantesToner;
	}

	public void setPagRestantesToner(Integer pagRestantesToner) {
		this.pagRestantesToner = pagRestantesToner;
	}
}