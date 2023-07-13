import java.util.ArrayList;

import checkPrinter.business.Supply;

public class Test {

	public static void main(String[] args) {
		Supply a = new Supply("123", null, null, null, null);
		Supply b = new Supply("123", "456987", null, null, null);
		Supply c = new Supply("123", "3535", null, null, null);
		Supply d = new Supply("123", "645646", null, null, null);
		Supply e = new Supply("123", "234234", null, null, null);
		System.out.println(a.equals(b));
		ArrayList<Supply> lista = new ArrayList<Supply>();
		
		lista.add(b);lista.add(c);lista.add(d);lista.add(e);
		
		System.out.println(lista.contains(a));
				
	}
}
