import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
// import ProductDetail from '../pages/ProductDetail';

class ProductsList extends React.Component {
  state = {
    idCategoriaSelecionada: '',
    categorias: [],
    inputSearch: '',
    recebeProdutos: [],
    carrinho: [],
  }

  componentDidMount() {
    this.buscaCategorias();
  }

 handleChange = ({ target }) => {
   const { name, value } = target;
   if (name === 'idCategoriaSelecionada') {
     this.setState({ [name]: value }, this.selecionarPorCategoria);
   }
   this.setState({ [name]: value });
 }

 buscaCategorias = async () => {
   const categorias = await getCategories();
   this.setState({
     categorias,
   });
 };

 selecionarPorCategoria = async () => {
   const { idCategoriaSelecionada } = this.state;
   const resultApi = await getProductsFromCategoryAndQuery(idCategoriaSelecionada, null);
   this.setState({ recebeProdutos: resultApi.results });
 }

 handleClick = async () => {
   const { inputSearch } = this.state;
   const resultApi = await getProductsFromCategoryAndQuery(null, inputSearch);
   this.setState({ recebeProdutos: resultApi.results });
 }

 colocarNoCarrinho = (event) => {
   const { recebeProdutos, carrinho } = this.state;
   const productId = event.target.value;
   const produtoSelecionado = recebeProdutos
     .filter((produto) => productId === produto.id);
   carrinho.push(produtoSelecionado[0]);
   this.setState({
     carrinho,
   });
 }

 render() {
   const { categorias, inputSearch, recebeProdutos, carrinho } = this.state;
   return (
     <div className='container-father'>
       <Link
        className='carrinho'
         data-testid="shopping-cart-button"
         to={
           { pathname: '/shoppingcart', state: { carrinho } }
         }
       >
         Carrinho
       </Link>
       <div className='cotainer-product'>
            <div className="categorias">
              <p>Categorias:</p>
              {
                categorias.map((categoria) => (
                  <label  key={ categoria.id } htmlFor={ categoria.id }>
                    { categoria.name }
                    <input
                      type="radio"
                      name="idCategoriaSelecionada"
                      id={ categoria.id }
                      value={ categoria.id }
                      onChange={ this.handleChange }
                    />
                  </label>
                ))
              }
            </div>
         <h1 data-testid="home-initial-message"
         className='lookingFor'>
         Digite algum termo de pesquisa ou escolha uma categoria.
       </h1>
       <div>
       <input 
         className='input-search'
         type="text"
         data-testid="query-input"
         name="inputSearch"
         value={ inputSearch }
         onChange={ this.handleChange }
       />
       <button 
         className='button-search'
         type="button"
         data-testid="query-button"
         onClick={ this.handleClick }
       >
         Buscar
       </button>
       </div>
       
       { recebeProdutos.length === 0 ? <h1>Nenhum produto foi encontrado</h1>
         : (
           <div className='card'>
             {recebeProdutos.map((produto) => (
               <div key={ produto.id } data-testid="product">
                 <Link
                   data-testid="product-detail-link"
                   to={
                     { pathname: `/productdetail/${produto.id}`, state: { produto } }
                   }
                 >
                   <p>{produto.title}</p>
                   <img src={ produto.thumbnail } alt={ produto.title } />
                   <span>
                     { produto.shipping.free_shipping
                     && <p data-testid="free-shipping">Frete grátis</p>}
                   </span>
                   <p className='price'>${produto.price}</p>
                 </Link>
                 <button
                   className='button-add-cart'
                   data-testid="product-add-to-cart"
                   type="button"
                   onClick={ this.colocarNoCarrinho }
                   value={ produto.id }
                 >
                   Adicionar ao Carrinho
                 </button>
               </div>))}
           </div>)}
           </div>
     </div>
   );
 }
}

export default withRouter(ProductsList);
