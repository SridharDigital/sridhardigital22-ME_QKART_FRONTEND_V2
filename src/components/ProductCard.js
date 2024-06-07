import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, category, cost, rating, image, _id } = product;
  const onClickAddToCart = () => {
    handleAddToCart(_id);
  };
  // console.log(_id);
  return (
    <Card sx={{ maxWidth: 345 }} className="card">
      <CardActionArea>
        <CardMedia component="img" height="140" image={image} alt={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          >
            ${cost}
          </Typography>
          <Rating name="read-only" value={rating} readOnly sx={{ mt: 2 }} />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          startIcon={<AddShoppingCartOutlined />}
          variant="contained"
          fullWidth
          onClick={onClickAddToCart}
          name="ADD TO CART"
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
