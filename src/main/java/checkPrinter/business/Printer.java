package checkPrinter.business;

import javax.persistence.Column;
//import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id; 

/*@Entity
@Table(name="PRI_PRINTER")*/
public class Printer implements Comparable<Printer>{

	private Integer id;
	private String name;
	private String marca;
	private String modelo;
	private String status;
	private Integer nivelToner;
	private Integer nivelKit;
	private Integer nivelUnidade;
	private String url;	
	private String cssNivel;
	private String cssKit;
	private String cssUnidade;
	private String cssName;
	private String cssStatusToner;
	private String cssStatusUnidade;
	private String cssStatusKit;
	private String serial;
	private String corToner;
	private Integer pagRestantesToner;
	private Integer pagRestantesKit; 
	private Integer pagRestantesUnidade;
	private String statusToner;
	private String statusUnidade;
	private String statuskit;
	private String corUnidade;
	private String serialToner;
	private String serialUnidade;
	private String serialKit;
	
	public Printer(String name, String url, String marca, String modelo, String serial) {
		super();
		this.name = name;
		this.url = url;
		this.serial = serial;
		this.modelo = modelo;
		this.marca = marca;
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="PRI_ID")
	public Integer getId() {
		return id;
	}
	@Column(name="PRI_NM")
	public String getName() {
		return name;
	}	
	@Column(name="PRI_NIV")
	public Integer getNivelToner() {
		return nivelToner;
	}
	@Column(name="PRI_KIT")
	public Integer getNivelKit() {
		return nivelKit;
	}	
	@Column(name="PRI_VID")
	public Integer getNivelUnidade() {
		return nivelUnidade;
	}	
	@Column(name="PRI_URL")
	public String getUrl() {
		return url;
	}
	@Column(name="PRI_STA")
	public String getStatusToner() {
		return statusToner;
	}
	public String getCssNivel() {
		return cssNivel;
	}
	public String getCssKit() {
		return cssKit;
	}
	public String getCssUnidade() {
		return cssUnidade;
	}
	public String getCssName() {
		return cssName;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public void setName(String nome) {
		this.name = nome;
	}
	public void setNivelToner(Integer nivel) {
		this.nivelToner = nivel;
	}
	public void setNivelKit(Integer kit) {
		this.nivelKit = kit;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public void setStatusToner(String status) {
		this.statusToner = status;
	}
	public void setCssNivelToner(String css) {
		this.cssNivel = css;
	}
	public void setCssNivelKit(String cssKit) {
		this.cssKit = cssKit;
	}
	public void setCssUnidade(String cssUnidade) {
		this.cssUnidade = cssUnidade;
	}
	public void setCssName(String cssName) {
		this.cssName = cssName;
	}
	public String getSerial() {
		return serial;
	}
	public void setSerial(String serial) {
		this.serial = serial;
	}
	
	public String getCorToner() {
		return corToner;
	}
	public Integer getPagRestantesToner() {
		return pagRestantesToner;
	}
	public void setCorToner(String cor) {
		this.corToner = cor;
	}
	public void setPagRestantesToner(Integer pagRestantes) {
		this.pagRestantesToner = pagRestantes;
	}
	public String getStatus() {
		return status;
	}
	public Integer getPagRestantesKit() {
		return pagRestantesKit;
	}
	public Integer getPagRestantesUnidade() {
		return pagRestantesUnidade;
	}
	public String getStatusUnidade() {
		return statusUnidade;
	}
	public String getStatuskit() {
		return statuskit;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public void setNivelUnidade(Integer nivelUnidade) {
		this.nivelUnidade = nivelUnidade;
	}
	public void setPagRestantesKit(Integer pagRestantesKit) {
		this.pagRestantesKit = pagRestantesKit;
	}
	public void setPagRestantesUnidade(Integer pagRestantesUnidade) {
		this.pagRestantesUnidade = pagRestantesUnidade;
	}
	public void setStatusUnidade(String statusUnidade) {
		this.statusUnidade = statusUnidade;
	}
	public void setStatuskit(String statuskit) {
		this.statuskit = statuskit;
	}
	public String getCorUnidade() {
		return corUnidade;
	}
	public void setCorUnidade(String corUnidade) {
		this.corUnidade = corUnidade;
	}
	public String getModelo() {
		return modelo;
	}
	public void setModelo(String modelo) {
		this.modelo = modelo;
	}
	public String getCssStatusToner() {
		return cssStatusToner;
	}
	public String getCssStatusUnidade() {
		return cssStatusUnidade;
	}
	public String getCssStatusKit() {
		return cssStatusKit;
	}
	public void setCssNivel(String cssNivel) {
		this.cssNivel = cssNivel;
	}
	public void setCssKit(String cssKit) {
		this.cssKit = cssKit;
	}
	public void setCssStatusToner(String cssStatusToner) {
		this.cssStatusToner = cssStatusToner;
	}
	public void setCssStatusUnidade(String cssStatusUnidade) {
		this.cssStatusUnidade = cssStatusUnidade;
	}
	public void setCssStatusKit(String cssStatusKit) {
		this.cssStatusKit = cssStatusKit;
	}
	public String getMarca() {
		return marca;
	}
	public void setMarca(String marca) {
		this.marca = marca;
	}
	
	
	public String getSerialToner() {
		return serialToner;
	}
	public String getSerialUnidade() {
		return serialUnidade;
	}
	public String getSerialKit() {
		return serialKit;
	}
	public void setSerialToner(String serialToner) {
		this.serialToner = serialToner;
	}
	public void setSerialUnidade(String serialUnidade) {
		this.serialUnidade = serialUnidade;
	}
	public void setSerialKit(String serialKit) {
		this.serialKit = serialKit;
	}
	public String aplicarCssNivel(Integer nivel) {
		 if(nivel < 30)
		 {
			 return "progress-bar bg-danger";

		 }else if(nivel > 30 && nivel < 50)
		 {							
			 return "progress-bar bg-warning";

		 } else if(nivel >= 50 && nivel < 75){
			 return "progress-bar bg-info";
		 }
		 else{
			 return "progress-bar bg-success";
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
		return "Printer [id=" + id + ", name=" + name + ", modelo=" + modelo + ", status=" + status + ", nivelToner="
				+ nivelToner + ", nivelKit=" + nivelKit + ", nivelUnidade=" + nivelUnidade + ", url=" + url
				+ ", cssNivel=" + cssNivel + ", cssKit=" + cssKit + ", cssUnidade=" + cssUnidade + ", cssName=" + cssName
				+ ", serial=" + serial + ", corToner=" + corToner + ", pagRestantesToner=" + pagRestantesToner
				+ ", pagRestantesKit=" + pagRestantesKit + ", pagRestantesUnidade=" + pagRestantesUnidade
				+ ", statusToner=" + statusToner + ", statusUnidade=" + statusUnidade + ", statuskit=" + statuskit
				+ ", corUnidade=" + corUnidade + "]";
	}
	@Override
	public int compareTo(Printer o) {
		try {
			if (o.status.equals("Offline")) {
				return -1;
			}else if (!o.equals(null) &  !this.equals(null) &
					!o.nivelToner.equals(null) & !this.nivelToner.equals(null) &
					this.getNivelToner() > o.getNivelToner()) {
				return 1;
			}else if (this.getNivelToner() < o.getNivelToner()) {
				return -1;
			}else {
				return 0;
			}
		} catch (Exception e) {
			System.out.println("catch: "+ o);
			return 0;
		}
		
		
	}

	
	
	
	
}
