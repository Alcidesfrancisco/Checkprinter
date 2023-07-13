package checkPrinter.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateConverter {
	private static SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
	public static Date stringToDate(String string) throws ParseException {
		return formato.parse(string); 
	}
	public static String dateToString(Date date) {
		return formato.format(date);
	}
	public static Boolean compareDates(Date dataArquivo, Date hoje) throws ParseException {
		System.out.println(hoje);
		String string = dateToString(hoje);
		Calendar cal1 = Calendar.getInstance();
		Calendar cal2 = Calendar.getInstance();
		cal1.setTime(dataArquivo);
		cal1.setTime(stringToDate(string));
		return cal1.after(cal2);
	}
	public static Date getHoje() throws ParseException {
		Date hoje = new Date();
		
		return formato.parse(hoje.getDate() + "/"+ (hoje.getMonth() +1) +"/"+ (hoje.getYear()+1900)); 
	}
	

	public static void main(String[] args) throws ParseException {

		System.out.println(getHoje());
		System.out.println(getHoje().equals(stringToDate("13/7/2023")));
		
	}
}
