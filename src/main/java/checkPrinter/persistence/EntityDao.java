package checkPrinter.persistence;



//import java.util.List;

// import javax.persistence.EntityManager;
// import javax.persistence.EntityManagerFactory;
// import javax.persistence.EntityTransaction;
// import javax.persistence.TypedQuery;

public abstract class EntityDao<E>{
	// private EntityManagerFactory factory;
	
	// public EntityDao(){
	// 	factory = EntityManagerHolder.factory;
		
	// }	
	// public E searchCar(Class<E> classe, Integer id) {
	// 	EntityManager manager = factory.createEntityManager();
	// 	return manager.find(classe, id); 
		
	// }
	
	// public void insertEntity(E entity) {
	// 	EntityManager manager = factory.createEntityManager();
	// 	EntityTransaction transaction = manager.getTransaction();
	// 	System.out.println(entity);
	// 	transaction.begin();
	// 	manager.persist(entity);
	// 	transaction.commit();
	// }
	
	// public List<E> listEntitys(Class<E> classe) {
		
	// 	String jpql = "select c from Car c";
	// 	System.out.println(jpql);
	// 	System.out.println(classe);
	// 	EntityManager manager = factory.createEntityManager();
	// 	TypedQuery<E> query = manager.createQuery(jpql, classe);
	// 	return query.getResultList();
	// }
	
	// public void updateEntity(E entity) {
	// 	EntityManager manager = factory.createEntityManager();
	// 	EntityTransaction transation = manager.getTransaction();
	// 	transation.begin();
	// 	manager.merge(entity);
	// 	transation.commit();
	// }
	
	// public void deleteEntity(Class<E> classe, Integer id) {
	// 	EntityManager manager = factory.createEntityManager();
	// 	EntityTransaction transaction = manager.getTransaction();
	// 	E entityManaged = manager.find(classe, id);
	// 	transaction.begin();
	// 	manager.remove(entityManaged);
	// 	transaction.commit();
		
	// }
}

	