package checkPrinter.presentation;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.faces.bean.ManagedBean;
import javax.faces.view.ViewScoped;

import org.json.simple.parser.ParseException;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Ocorrencia;
import checkPrinter.business.Printer;
import checkPrinter.business.Supplies;
import checkPrinter.business.Supply;
import checkPrinter.util.DateConverter;
import checkPrinter.util.EnviarZap;
import checkPrinter.util.JsonHandle;

@ManagedBean
public class Index {

	private List<Printer> printers;
	private List<String> erros = new ArrayList<>();
	private String arquivoJson = System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.json";
	private String arquivoTxt = System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.txt";
	private JsonHandle jh = new JsonHandle();
	private Supplies supplies;

	public List<Printer> getPrinters() {
		return printers;
	}

	public void setPrinters(List<Printer> printers) {
		this.printers = printers;
	}

	public Index() {
		
		initPrinters();

	}

	@SuppressWarnings("serial")
	private void initPrinters() {
		printers = new ArrayList<Printer>();

		if (new File(arquivoJson).exists()) {

			try {
				supplies = jh.carregaJsonSupplies();
				List<Printer> printersTemp = jh.carregaJsonPrinters();
				if (printersTemp.size() == 0)
					throw new IOException();

				for (Printer p : printersTemp) {
					if (p.getModelo().contains("MX622") || p.getModelo().contains("MS622")) {
						Mx622 mx622 = new Mx622(p.getName(), p.getUrl(), p.getMarca(), p.getModelo(), p.getSerial());
						/*
						 * Ocorrencia ocorrencia = new Ocorrencia(p.getSerial(),
						 * "impressora carregada do Json", "impressora", new Date());
						 */

						// mx622.setOcorrencias(p.getOcorrencias());
						// mx622.getOcorrencias().add(ocorrencia);
						Thread thread = new Thread(mx622);
						thread.start();
						printers.add(mx622);
						enviarMensagemZap(p);

					} else if (p.getModelo().contains("MX910")) {
						Mx910 mx910 = new Mx910(p.getName(), p.getUrl(), p.getMarca(), p.getModelo(), p.getSerial());
						mx910.setOcorrencias(p.getOcorrencias());
						mx910.getOcorrencias().add(new Ocorrencia(p.getSerial(), "impressora carregada do Json",
								"impressora", new Date()));
						Thread thread = new Thread(mx910);
						thread.start();
						printers.add(mx910);
						mx910.setEstatisticasPrinterMX910();
						enviarMensagemZap(p);

					} else if (p.getModelo().contains("CX725")) {
						Cx725 cx725 = new Cx725(p.getName(), p.getUrl(), p.getMarca(), p.getModelo(), p.getSerial());
						cx725.setOcorrencias(p.getOcorrencias());
						cx725.getOcorrencias().add(new Ocorrencia(p.getSerial(), "impressora carregada do Json",
								"impressora", new Date()));
						Thread thread = new Thread(cx725);
						thread.start();
						printers.add(cx725);
						enviarMensagemZap(p);
					}

				}
				TimeUnit.SECONDS.sleep(2);

				for (Printer printer : printers) {
					if (printer.getStatus().equals("Offline")) {
						Printer obj = new JsonHandle().getPrinterJson(printer);
						obj.setCssNivelToner(obj.aplicarCssNivel(obj.getNivelToner()));
						obj.setCssNivelKit(obj.aplicarCssNivel(obj.getNivelKit()));
						obj.setCssUnidade(obj.aplicarCssNivel(obj.getNivelUnidade()));
						obj.setCssStatusToner(obj.aplicarCssStatus(obj.getStatusToner()));
						obj.setCssStatusUnidade(obj.aplicarCssStatus(obj.getStatusUnidade()));
						obj.setCssStatusKit(obj.aplicarCssStatus(obj.getStatuskit()));
						obj.setStatus("OffLine");
						obj.setCssName("list-group-item list-group-item-danger");

						printers.set(printers.indexOf(printer), obj);
					} else {
						if (printer.getModelo().contains("MX622")) {
							System.out.println("Antes da adição " + supplies);
							System.out.println(supplies.getToners().size());
							supplies.addToner(
									new Supply(printer.getSerialToner(), printer.getSerial(), new ArrayList<Integer>() {
										{
											add(printer.getNivelToner());
										}
									}, new ArrayList<String>() {
										{
											add(DateConverter.dateToString(DateConverter.getHoje()));
										}
									}, DateConverter.dateToString(DateConverter.getHoje())));
							supplies.addUnidade(new Supply(printer.getSerialUnidade(), printer.getSerial(),
									new ArrayList<Integer>() {
										{
											add(printer.getNivelToner());
										}
									}, new ArrayList<String>() {
										{
											add(DateConverter.dateToString(DateConverter.getHoje()));
										}
									}, DateConverter.dateToString(DateConverter.getHoje())));
							supplies.addKit(
									new Supply(printer.getSerialKit(), printer.getSerial(), new ArrayList<Integer>() {
										{
											add(printer.getNivelToner());
										}
									}, new ArrayList<String>() {
										{
											add(DateConverter.dateToString(DateConverter.getHoje()));
										}
									}, DateConverter.dateToString(DateConverter.getHoje())));
						}
					}
				}
				Collections.sort(printers);
				jh.EscreverJsonPrinters(printers);
				jh.EscreverJsonSupplies(supplies);
				System.out.println("Depois da adição " + supplies);
				System.out.println(supplies.getToners().size());
				System.out.println(supplies.getToners().size());
				supplies = new Supplies();
			} catch (IOException | ParseException e) {
				e.printStackTrace();
				System.out.println("LoadFile()1");
				loadFile();
				// e.printStackTrace();
			} catch (InterruptedException e) {
				System.out.println("Erro no Index");
				e.printStackTrace();
			} catch (java.text.ParseException e) {
				e.printStackTrace();
			}
		} else {
			System.out.println("LoadFile()2");
			loadFile();
		}
	}

	public List<String> getErros() {
		return erros;
	}

	public void setErros(List<String> erros) {
		this.erros = erros;
	}

	public String nivelToString(Integer nivelToner) {

		return nivelToner.toString() + "%";
	}

	public void loadFile() {
		try {

			File file = new File("/opt/tomcat/webapps/CheckPrinter/printers.txt"); // para Server

			if (!file.exists()) {
				file = new File(arquivoTxt); // para localHost
			}

			InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
			BufferedReader reader = new BufferedReader(fileReader);
			String dados = null;
			printers = new ArrayList<Printer>();
			while ((dados = reader.readLine()) != null) {
				String[] temp = dados.split(" ");
				if (temp[3].contains("MX622") || temp[3].contains("MS622")) {
					Mx622 mx622 = new Mx622(temp[0], temp[1], temp[2], temp[3], temp[4]);
					Thread thread = new Thread(mx622);
					thread.start();
					// if(mx622.getStatus().equals("Offline")) mx622 = (Mx622) new
					// JsonHandle().getPrinterJson(mx622);
					printers.add(mx622);

				} else if (temp[3].contains("MX910")) {
					Mx910 mx910 = new Mx910(temp[0], temp[1], temp[2], temp[3], temp[4]);
					Thread thread = new Thread(mx910);
					thread.start();
					printers.add(mx910);

				} else if (temp[3].contains("CX725")) {
					Cx725 cx725 = new Cx725(temp[0], temp[1], temp[2], temp[3], temp[4]);
					Thread thread = new Thread(cx725);
					thread.start();
					printers.add(cx725);
				}

			}
			fileReader.close();
			reader.close();
			TimeUnit.SECONDS.sleep(2);
			Collections.sort(printers);

			for (Printer p : printers) {

				Ocorrencia ocorrencia = new Ocorrencia(p.getSerial(), "Impressora Carregada", "impressora", new Date());
				p.getOcorrencias().add(ocorrencia);
				enviarMensagemZap(p);

			}
			JsonHandle jh = new JsonHandle();
			jh.EscreverJsonPrinters(printers);
			jh.EscreverJsonSupplies(new Supplies());
		} catch (IOException | InterruptedException e) {
			erros.add(e.toString());
			e.printStackTrace();
		}

	}

	public void enviarMensagemZap(Printer printer) {
		EnviarZap zap = new EnviarZap();

		// TODO receber as mensagens na API para usar o resultado para filtrar se as
		// mensagens de lá já fora lida ou não
		try {
			if (!printer.getNivelToner().equals(null) && printer.getNivelToner() <= 10) {
				String mensagem = "*AVISO DE SUPRIMENTO BAIXO DE IMPRESSORA*\n" + "Marca: " + printer.getMarca() + "\n"
						+ "Modelo: " + printer.getModelo() + "\n" + "Serial: " + printer.getSerial() + "\n" + "IP: "
						+ printer.getUrl() + "\n" + "Nivel do Toner: " + printer.getNivelToner() + "%\n"
						+ "Serial do Toner: " + printer.getSerialToner() + "\n" + "Páginas restantes: "
						+ printer.getPagRestantesToner() + "\n" + "\n" + "Digite a opção de resposta (OK)- ";

				// TODO - mudar argumento para printer
				zap.enviaNotificacao(mensagem);
			}
		} catch (Exception e) {

			System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXX");

			// System.out.println(e.getMessage());

		}

	}
	/*
	 * public void gravarLog(Printer p) throws IOException, ParseException,
	 * java.text.ParseException { JsonHandle jh = new JsonHandle();
	 * ArrayList<Integer> consumo = new ArrayList<Integer>() ; ArrayList<String>
	 * dias = new ArrayList<String>(); consumo.add(p.getNivelToner());
	 * System.out.println(consumo);
	 * dias.add(DateConverter.dateToString(DateConverter.getHoje())); Supply toner =
	 * new Supply( p.getSerialToner(), p.getSerial(), consumo, dias,
	 * DateConverter.dateToString(DateConverter.getHoje())); Supply unidade = new
	 * Supply( p.getSerialUnidade(), p.getSerial(), consumo, dias,
	 * DateConverter.dateToString(DateConverter.getHoje())); Supply kit = new
	 * Supply( p.getSerialKit(), p.getSerial(), consumo, dias,
	 * DateConverter.dateToString(DateConverter.getHoje()));
	 * System.out.println(toner); System.out.println(unidade);
	 * System.out.println(kit);
	 * 
	 * Supplies supplies = new Supplies(new ArrayList<Supply>() {{add(toner);}}, new
	 * ArrayList<Supply>() {{add(unidade);}}, new ArrayList<Supply>()
	 * {{add(kit);}});
	 * 
	 * try { //Supplies sup = jh.carregaJsonSupplies(); } catch (Exception e) {
	 * //supplies = new Supplies(new ArrayList<Supply>() {{add(toner);}}, new
	 * ArrayList<Supply>() {{add(unidade);}}, new ArrayList<Supply>()
	 * {{add(kit);}}); } //System.out.println("JOSN       " + sup);
	 * System.out.println("Em Execução"+supplies);
	 * 
	 * 
	 * System.err.println("adiciona toner"); System.out.println();
	 * 
	 * supplies.getToners().add(toner); supplies.getUnidades().add(unidade);
	 * supplies.getKits().add(kit); System.err.println(supplies);
	 * 
	 * 
	 * 
	 * for (int i = 0; i < toners.size(); i++) {
	 * 
	 * 
	 * if(DateConverter.stringToDate(toners.get(i).getUltimaData()).after(
	 * DateConverter.getHoje())) {
	 * if(toners.get(i).getSerial().equals(p.getSerial())) {
	 * 
	 * } } }
	 * 
	 * 
	 * 
	 * System.out.println(supplies);
	 * System.out.println(supplies.getToners().size());
	 * System.out.println(supplies.getUnidades().size());
	 * System.out.println(supplies.getKits().size());
	 * jh.EscreverJsonSupplies(supplies); }
	 */

	private Cx725 cx;

	public Cx725 getCx() {
		return cx;
	}

	public void setCx(Cx725 cx) {
		this.cx = cx;
	}

	public void printerConverter(Printer printer) {

		if (printer instanceof Cx725) {
			Cx725 cx725 = (Cx725) printer;
			cx = cx725;
		}
	}
}