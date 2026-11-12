import Guitar from "./components/Guitar";
import Header from "./components/Header";
import GuitarForm from "./components/GuitarForm";
import { useState } from "react";
import { useCart } from "./hooks/useCart";
function App() {
  const {
    cart,
    data,
    loading,
    error,
    loadGuitars,
    isEmpty,
    cartTotal,
    addToCart,
    decreseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [view, setView] = useState<"catalog" | "form">("catalog");

  return (
    <>
      <Header
        cart={cart}
        decreseQuantity={decreseQuantity}
        increaseQuantity={increaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
      />

      <main className="container-xl mt-5">
        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            type="button"
            className={`btn ${view === "catalog" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("catalog")}
          >
            Catálogo
          </button>
          <button
            type="button"
            className={`btn ${view === "form" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("form")}
          >
            Agregar guitarra
          </button>
        </div>

        {view === "form" ? (
          <GuitarForm
            onCreated={() => {
              loadGuitars();
              setView("catalog");
            }}
          />
        ) : (
          <>
            <h2 className="text-center">Nuestra Colección</h2>

            {loading && <p className="text-center mt-5">Cargando guitarras...</p>}
            {error && <div className="alert alert-danger mt-5">{error}</div>}
            {!loading && !error && data.length === 0 && (
              <p className="text-center mt-5">Aún no hay guitarras registradas.</p>
            )}

            <div className="row mt-5">
              {data.map((guitar) => (
                <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
