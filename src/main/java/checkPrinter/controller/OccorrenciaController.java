package checkPrinter.controller;

import checkPrinter.business.Ocorrencia;
import checkPrinter.business.Printer;

public class OccorrenciaController {
	
	public Boolean controlaOcorrencia(Ocorrencia ocorrencia, Printer printer){
		
		switch (ocorrencia.getTipo()) {
		case "impressora":
			return controleTipoImpressora(ocorrencia, printer);
			
		default:
			return false;
		}
		
		
		
	}

	private Boolean controleTipoImpressora(Ocorrencia ocorrencia, Printer printer) {
		
		
		
		
		
		return true;
	}

}
