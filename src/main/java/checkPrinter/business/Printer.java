package checkPrinter.business;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;




public class Printer implements Comparable<Printer>{

	private Integer id;
	private String name;
	private String marca;
	private String modelo;
	private String status;
	private String url;
	private String serial;

	protected Integer totalImpressoes;

	private Toner tonerObj = new Toner();

	private UnidadeDeImagem unidade = new UnidadeDeImagem();

	private KitManutecao kitManutecao = new KitManutecao();

	private Estilo estilo = new Estilo();

	private List<Ocorrencia> ocorrencias;

	public Printer(String name, String url, String marca, String modelo, String serial) {
		super();
		this.name = name;
		this.url = url;
		this.serial = serial;
		this.modelo = modelo;
		this.marca = marca;
		this.ocorrencias = new ArrayList<Ocorrencia>();
		this.tonerObj = new Toner();
		this.totalImpressoes = 0;
	}

	public List<Ocorrencia> getOcorrencias() {
		return ocorrencias;
	}
	public void setOcorrencias(List<Ocorrencia> ocorrencias) {
		this.ocorrencias = ocorrencias;
	}

	public Integer getId() {
		return id;
	}
	public String getName() {
		return name;
	}	
	public Integer getNivelToner() {
		return tonerObj.getNivelToner();
	}
	public Integer getNivelKit() {
		return kitManutecao.getNivelKit();
	}	
	public Integer getNivelUnidade() {
		return unidade.getNivelUnidade();
	}	
	public String getUrl() {
		return url;
	}

	public String getStatusToner() {
		return tonerObj.getStatusToner();
	}
	public String getCssNivel() {
		return estilo.getCssNivel();
	}
	public String getCssKit() {
		return estilo.getCssKit();
	}
	public String getCssUnidade() {
		return estilo.getCssUnidade();
	}
	public String getCssName() {
		return estilo.getCssName();
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public void setName(String nome) {
		this.name = nome;
	}
	public void setNivelToner(Integer nivel) {
		this.tonerObj.setNivelToner(nivel);
	}
	public void setNivelKit(Integer kit) {
		this.kitManutecao.setNivelKit(kit);
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public void setStatusToner(String status) {
		this.tonerObj.setStatusToner(status);
	}
	public void setCssNivelToner(String css) {
		this.estilo.setCssNivel(css);
	}
	public void setCssNivelKit(String cssKit) {
		this.estilo.setCssKit(cssKit);
	}
	public void setCssUnidade(String cssUnidade) {
		this.estilo.setCssUnidade(cssUnidade);
	}
	public void setCssName(String cssName) {
		this.estilo.setCssName(cssName);
	}
	public String getSerial() {
		return serial;
	}
	public void setSerial(String serial) {
		this.serial = serial;
	}

	public String getCorToner() {
		return tonerObj.getCorToner();
	}
	public Integer getPagRestantesToner() {
		return tonerObj.getPagRestantesToner();
	}
	public void setCorToner(String cor) {
		this.tonerObj.setCorToner(cor);
	}
	public void setPagRestantesToner(Integer pagRestantes) {
		this.tonerObj.setPagRestantesToner(pagRestantes);
	}
	public String getStatus() {
		return status;
	}
	public Integer getPagRestantesKit() {
		return kitManutecao.getPagRestantesKit();
	}
	public Integer getPagRestantesUnidade() {
		return unidade.getPagRestantesUnidade();
	}
	public String getStatusUnidade() {
		return unidade.getStatusUnidade();
	}
	public String getStatuskit() {
		return kitManutecao.getStatuskit();
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public void setNivelUnidade(Integer nivelUnidade) {
		this.unidade.setNivelUnidade(nivelUnidade);
	}
	public void setPagRestantesKit(Integer pagRestantesKit) {
		this.kitManutecao.setPagRestantesKit(pagRestantesKit);
	}
	public void setPagRestantesUnidade(Integer pagRestantesUnidade) {
		this.unidade.setPagRestantesUnidade(pagRestantesUnidade);
	}
	public void setStatusUnidade(String statusUnidade) {
		this.unidade.setStatusUnidade(statusUnidade);
	}
	public void setStatuskit(String statuskit) {
		this.kitManutecao.setStatuskit(statuskit);
	}
	public String getCorUnidade() {
		return unidade.getCorUnidade();
	}
	public void setCorUnidade(String corUnidade) {
		this.unidade.setCorUnidade(corUnidade);
	}
	public String getModelo() {
		return modelo;
	}
	public void setModelo(String modelo) {
		this.modelo = modelo;
	}
	public String getCssStatusToner() {
		return estilo.getCssStatusToner();
	}
	public String getCssStatusUnidade() {
		return estilo.getCssStatusUnidade();
	}
	public String getCssStatusKit() {
		return estilo.getCssStatusKit();
	}
	public void setCssNivel(String cssNivel) {
		this.estilo.setCssNivel(cssNivel);
	}
	public void setCssKit(String cssKit) {
		this.estilo.setCssKit(cssKit);
	}
	public void setCssStatusToner(String cssStatusToner) {
		this.estilo.setCssStatusToner(cssStatusToner);
	}
	public void setCssStatusUnidade(String cssStatusUnidade) {
		this.estilo.setCssStatusUnidade(cssStatusUnidade);
	}
	public void setCssStatusKit(String cssStatusKit) {
		this.estilo.setCssStatusKit(cssStatusKit);
	}
	public String getMarca() {
		return marca;
	}
	public void setMarca(String marca) {
		this.marca = marca;
	}


	public String getSerialToner() {
		return tonerObj.getSerialToner();
	}
	public String getSerialUnidade() {
		return unidade.getSerialUnidade();
	}
	public String getSerialKit() {
		return kitManutecao.getSerialKit();
	}
	public void setSerialToner(String serialToner) {
		this.tonerObj.setSerialToner(serialToner);
	}
	public void setSerialUnidade(String serialUnidade) {
		this.unidade.setSerialUnidade(serialUnidade);
	}
	public void setSerialKit(String serialKit) {
		this.kitManutecao.setSerialKit(serialKit);
	}
	public String aplicarCssNivel(Integer nivel) {
		if(nivel < 30)
		{
			return "progress-bar progress-bar-striped bg-danger";

		}else if(nivel > 30 && nivel < 50)
		{							
			return "progress-bar progress-bar-striped bg-warning";

		} else if(nivel >= 50 && nivel < 75){
			return "progress-bar progress-bar-striped bg-info";
		}
		else{
			return "progress-bar progress-bar-striped bg-success";
		}
	}
	public String aplicarCssStatus(String status) {
		if(status != null && status.contains("OK")) {
			return "badge badge-success";
		}else {
			return "badge badge-warning";
		}
	}

	@Override
	public String toString() {
		return "Printer [id=" + id + ", name=" + name + ", modelo=" + modelo + ", status=" + status + "Total de impressoes= "+totalImpressoes + ", nivelToner="
				+ tonerObj.getNivelToner() + ", nivelKit=" + kitManutecao.getNivelKit() + ", nivelUnidade=" + unidade.getNivelUnidade() + ", url=" + url
				+ ", cssNivel=" + estilo.getCssNivel() + ", cssKit=" + estilo.getCssKit() + ", cssUnidade=" + estilo.getCssUnidade() + ", cssName=" + estilo.getCssName()
				+ ", serial=" + serial + ", corToner=" + tonerObj.getCorToner() + ", pagRestantesToner=" + tonerObj.getPagRestantesToner()
				+ ", pagRestantesKit=" + kitManutecao.getPagRestantesKit() + ", pagRestantesUnidade=" + unidade.getPagRestantesUnidade()
				+ ", statusToner=" + tonerObj.getStatusToner() + ", statusUnidade=" + unidade.getStatusUnidade() + ", statuskit=" + kitManutecao.getStatuskit()
				+ ", corUnidade=" + unidade.getCorUnidade() + "]" + ocorrencias ;
	}
	@Override
	public int compareTo(Printer o) {
		try {
			if (o.status.equals("Offline")) {
				return -1;
			}else if (!o.equals(null) &  !this.equals(null) &
					!o.tonerObj.getNivelToner().equals(null) & !this.tonerObj.getNivelToner().equals(null) &
					this.getNivelToner() > o.getNivelToner()) {
				return 1;
			}else if (this.getNivelToner() < o.getNivelToner()) {
				return -1;
			}else {
				return 0;
			}
		} catch (Exception e) {
			return 0;
		}


	}

	public Integer getTotalImpressoes() {
		return totalImpressoes;
	}

	public void setTotalImpressoes(Integer totalImpressoes) {
		this.totalImpressoes = totalImpressoes;
	}

	public void setEstatisticasPrinter() throws IOException {

		URL url = new URL(this.getUrl() + "/webglue/getReport?name=PrintConfigHealthCheckStatistics&lang=en");



		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setReadTimeout(1000);

		conn.setConnectTimeout(1000);

		BufferedReader in;
		if(conn.getResponseCode() >= 200 && conn.getResponseCode() < 399)
		{

			in = new BufferedReader(new InputStreamReader(url.openStream()));
			String inputLine;

			while ((inputLine = in.readLine()) != null) {
				if(inputLine.contains("Page")) {
					this.totalImpressoes = Integer.parseInt(inputLine.split("</div></li><li><div")[13].split(">")[1]);
					}
				}
				
			}
		}
	
}
