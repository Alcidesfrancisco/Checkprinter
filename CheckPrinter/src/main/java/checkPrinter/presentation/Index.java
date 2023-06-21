package checkPrinter.presentation;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.faces.bean.ManagedBean;

import checkPrinter.business.Cx725;
import checkPrinter.business.Mx622;
import checkPrinter.business.Mx910;
import checkPrinter.business.Printer;
import checkPrinter.util.EnviarZap;
import checkPrinter.util.JsonHandle;

@ManagedBean
public class Index{

	private List<Printer> printers;
	private List<String> erros = new ArrayList<>();





	public List<Printer> getPrinters() {
		return printers;
	}
	public void setPrinters(List<Printer> printers) {
		this.printers = printers;
	}


	public Index() {
		printers = new ArrayList<Printer>();
		loadFile();
	}


	public List<String> getErros() {
		return erros;
	}
	public void setErros(List<String> erros) {
		this.erros = erros;
	}
	public String nivelTonerToString(Integer nivelToner) {
		return nivelToner.toString() + "%";
	}
	public void  loadFile()
	{
		try {

			File file = new File("/opt/tomcat/webapps/CheckPrinter/printers.txt"); // para Server

			if(!file.exists()) {
				file = new File(System.getProperty("user.dir") + "\\src\\main\\webapp\\printers.txt"); //para localHost
			}

			InputStreamReader fileReader = new InputStreamReader(new FileInputStream(file.getPath()), "utf-8");
			BufferedReader reader = new BufferedReader(fileReader);
			String dados = null;
			printers = new ArrayList<Printer>();
			while((dados = reader.readLine()) != null){
				String[] temp = dados.split(" ");
				if(temp[3].contains("MX622") || temp[3].contains("MS622")) {
					Mx622 mx622 = new Mx622(temp[0], temp[1], temp[2], temp[3], temp[4]);
					Thread thread = new Thread(mx622);
					thread.start();
					printers.add(mx622);
					
					
					System.out.println(mx622);
				}else if(temp[3].contains("MX910")) {
					Mx910 mx910 = new Mx910(temp[0], temp[1], temp[2], temp[3], temp[4]);
					Thread thread = new Thread(mx910);
					thread.start();
					printers.add(mx910);
					
					System.out.println(mx910);
				}else if(temp[3].contains("CX725")) {
					Cx725 cx725 = new Cx725(temp[0], temp[1], temp[2], temp[3], temp[4]);
					cx725.carregarArquivo();
					printers.add(cx725);
					System.out.println(cx725);
				}
				
			}
			fileReader.close();
			reader.close();
			TimeUnit.SECONDS.sleep(2);
			Collections.sort(printers);
			JsonHandle jh = new JsonHandle();
			jh.EscreverJsonPrinters(printers);
			for (Printer p : printers) {
				
				enviarMensagemZap(p);
			}
			
		} catch (IOException | InterruptedException e) {
			erros.add(e.toString());
			e.printStackTrace();
		}

	}
	public void enviarMensagemZap(Printer printer) {
		EnviarZap zap = new EnviarZap();
		try {
			if(printer.getNivelToner() <= 10){
				String mensagem = "*AVISO DE SUPRIMENTO BAIXO DE IMPRESSORA*\n"
						+ "Modelo: " + printer.getMarca() + " " + printer.getModelo() + "\n"
						+ "Serial: " + printer.getSerial() + "\n"
						+ "IP: " + printer.getUrl() + "\n"
						+ "Nivel do Toner: " + printer.getNivelToner() + "%\n"
						+ "Serial do Toner: " + printer.getSerialToner() + "\n"
						+ "P�ginas restantes: " + printer.getPagRestantesToner() + "\n";
				
				
				zap.enviaNotificacao(mensagem);
			}
		} catch (Exception e) {
			System.out.println("Deu merda" + e.getStackTrace());
		}
		
	}
	
	private Cx725 cx;
	public Cx725 getCx() {
		return cx;
	}
	public void setCx(Cx725 cx) {
		this.cx = cx;
	}
	public void printerConverter(Printer printer) {
		
		if(printer instanceof Cx725 ) {
			Cx725 cx725 = (Cx725) printer;
			cx =  cx725;
		}
	}
	//TODO localizar JS de estat�sticas : http://150.161.80.19/#/Settings/Reports/ReportDeviceGroup


}