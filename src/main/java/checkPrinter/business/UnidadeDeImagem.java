package checkPrinter.business;

public class UnidadeDeImagem {
	private Integer nivelUnidade;
	private String corUnidade;
	private String serialUnidade;
	private String statusUnidade;
	private Integer pagRestantesUnidade;

	public UnidadeDeImagem() {
	}

	public Integer getNivelUnidade() {
		return nivelUnidade;
	}

	public void setNivelUnidade(Integer nivelUnidade) {
		this.nivelUnidade = nivelUnidade;
	}

	public String getCorUnidade() {
		return corUnidade;
	}

	public void setCorUnidade(String corUnidade) {
		this.corUnidade = corUnidade;
	}

	public String getSerialUnidade() {
		return serialUnidade;
	}

	public void setSerialUnidade(String serialUnidade) {
		this.serialUnidade = serialUnidade;
	}

	public String getStatusUnidade() {
		return statusUnidade;
	}

	public void setStatusUnidade(String statusUnidade) {
		this.statusUnidade = statusUnidade;
	}

	public Integer getPagRestantesUnidade() {
		return pagRestantesUnidade;
	}

	public void setPagRestantesUnidade(Integer pagRestantesUnidade) {
		this.pagRestantesUnidade = pagRestantesUnidade;
	}
}