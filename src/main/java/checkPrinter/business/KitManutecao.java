package checkPrinter.business;

public class KitManutecao {
	private Integer pagRestantesKit;
	private String statuskit;
	private String serialKit;
	private Integer nivelKit;

	public KitManutecao() {
	}

	public Integer getPagRestantesKit() {
		return pagRestantesKit;
	}

	public void setPagRestantesKit(Integer pagRestantesKit) {
		this.pagRestantesKit = pagRestantesKit;
	}

	public String getStatuskit() {
		return statuskit;
	}

	public void setStatuskit(String statuskit) {
		this.statuskit = statuskit;
	}

	public String getSerialKit() {
		return serialKit;
	}

	public void setSerialKit(String serialKit) {
		this.serialKit = serialKit;
	}

	public Integer getNivelKit() {
		return nivelKit;
	}

	public void setNivelKit(Integer nivelKit) {
		this.nivelKit = nivelKit;
	}
}