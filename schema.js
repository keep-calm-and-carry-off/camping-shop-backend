// schema.js
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const { supabase, supabaseAdmin } = require('./supabase');

// Тип Product
const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    description: { type: GraphQLString },
    image_url: { type: GraphQLString },
    category_id: { type: GraphQLString }
  })
});

// Тип User
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    last_name: { type: GraphQLString },
    first_name: { type: GraphQLString },
    middle_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    role: { type: GraphQLString },
    registration_date: { type: GraphQLString },
    last_login: { type: GraphQLString },
    address: { type: GraphQLString },
    balance: { type: GraphQLString }
  })
});

// Тип Warehouse
const WarehouseType = new GraphQLObjectType({
  name: 'Warehouse',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    description: { type: GraphQLString },
    working_hours: { type: GraphQLString }
  })
});

// Тип OrderStatus
const OrderStatusType = new GraphQLObjectType({
  name: 'OrderStatus',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});

// Тип OrderItem
const OrderItemType = new GraphQLObjectType({
  name: 'OrderItem',
  fields: () => ({
    id: { type: GraphQLString },
    order_id: { type: GraphQLString },
    product_id: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    price: { type: GraphQLString }
  })
});

// Тип Order
const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    status_id: { type: GraphQLString },
    total_price: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    delivery_address: { type: GraphQLString },
    comment: { type: GraphQLString },
    items: {
      type: new GraphQLList(OrderItemType),
      resolve(parent) {
        return supabase.from('order_items').select('*').eq('order_id', parent.id);
      }
    },
    status: {
      type: OrderStatusType,
      resolve(parent) {
        return supabase.from('order_statuses').select('*').eq('id', parent.status_id).single();
      }
    }
  })
});

// Корневой Query тип
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Запросы для products
    product: {
      type: ProductType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return supabase.from('products').select('*').eq('id', args.id).single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve() {
        return supabase.from('products').select('*').then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });
      }
    },

    // Запросы для пользователей
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return supabaseAdmin.from('users').select('*').eq('id', args.id).single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return supabaseAdmin.from('users').select('*').then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },

    // Запросы для складов
    warehouse: {
      type: WarehouseType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return supabase.from('warehouses').select('*').eq('id', args.id).single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },
    warehouses: {
      type: new GraphQLList(WarehouseType),
      resolve() {
        return supabase.from('warehouses').select('*').then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },

    // Запросы для order_statuses
    orderStatus: {
      type: OrderStatusType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return supabase.from('order_statuses').select('*').eq('id', args.id).single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },
    orderStatuses: {
      type: new GraphQLList(OrderStatusType),
      resolve() {
        return supabase.from('order_statuses').select('*').then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },

    // Запросы для orders
    order: {
      type: OrderType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return supabase.from('orders').select('*').eq('id', args.id).single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve() {
        return supabase.from('orders').select('*').then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    }
  }
});

// Мутации
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Создание пользователя
    createUser: {
      type: UserType,
      args: {
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        middle_name: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        password_hash: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return supabaseAdmin.from('users').insert(args).select().single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },

    // Создание склада
    createWarehouse: {
      type: WarehouseType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString },
        description: { type: GraphQLString },
        working_hours: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return supabaseAdmin.from('warehouses').insert(args).select().single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },

    // Создание заказа
    createOrder: {
      type: OrderType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        status_id: { type: new GraphQLNonNull(GraphQLString) },
        total_price: { type: new GraphQLNonNull(GraphQLString) },
        delivery_address: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: GraphQLString }
      },
      resolve(parent, args) {
        return supabaseAdmin.from('orders').insert(args).select().single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });;
      }
    },

    // Добавление товара в заказ
    addOrderItem: {
      type: OrderItemType,
      args: {
        order_id: { type: new GraphQLNonNull(GraphQLString) },
        product_id: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
        price: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return supabaseAdmin.from('order_items').insert(args).select().single().then(result => result.data || []).catch(err => {
          console.error('Ошибка сервера', err.message);
          return []
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });