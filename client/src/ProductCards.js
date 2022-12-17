function ProductCards() {
    return (
        <figure class="card">
            <div class="card__emoji">IMAGEIMAGE</div>
            <div class="card__title-box">
                <h2 class="card__title">PRODUCTNAME</h2>
            </div>

            <div class="card__details">
                <div class="card__detail-box NOT_ORGANIC">
                    <h6 class="card__detail card__detail--organic">Organic!</h6>
                </div>

                <div class="card__detail-box">
                    <h6 class="card__detail">QUANTITY per 📦</h6>
                </div>

                <div class="card__detail-box">
                    <h6 class="card__detail card__detail--price">PRICE€</h6>
                </div>
            </div>

            <a class="card__link" href="/product?id=ID">
                <span>Detail <i class="emoji-right">👉</i></span>
            </a>
        </figure>

    );
}

export default ProductCards;