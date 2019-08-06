Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required:true
        }
    },
    template: `
    <div class="product">
    <div class="product-image">
        <img v-bind:src="image">
    </div>

    <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
            
            <!-- v-on there is shorthand for this @-->
            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>

            <button @click="addToCart" 
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }">Add to Cart</button>
    </div>

    <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
            <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
            </li>
        </ul>
    </div>

    <product-review @review-submitted="addReview"></product-review>

</div>
    `,
    data () {
        return {
        brand: 'Vue Mastery',
        product: 'Socks',
        selectedVariant: 0,
        //image: "./assets/vmSocks-green-onWhite.jpg",
        //inStock: true, turn it into a computed property inStock instead of selecting a boolean, it'll select quantity
        //inventory: 0,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variandId: 2234,
                variantColor: "green",
                variantImage: './assets/vmSocks-green-onWhite.jpg',
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }
        ],
        reviews: []
    }
    },  
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variandId)
        }, 
        updateProduct: function (index) {
            //this.image = variantImage
            this.selectedVariant = index
            console.log(index)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping(){
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    }
})

Vue.config.devtools = true

Vue.component('product-review', {
    template:`
    <!-- event modifier will prevent the default behavior, in other words, the page won't refresh
       when we submit this form and since we are not posting to an external api, we won't have any action either -->
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <input type="submit" value="Submit">
        </p>

    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.review = null
            }
            else {
                if(!this.name) this.errors.push("Name is required")
                if(!this.review) this.errors.push("Review is required")
                if(!this.rating) this.errors.push("Rating is required")
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            //this.cart += 1
            this.cart.push(id)
        }
    }
})
//instead of writing our methods as anonymous functions, we can use ESX shorthand like addToCart(), not all browsers support this feature.