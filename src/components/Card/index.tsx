import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

interface CustomCardProps {
  children: JSX.Element | JSX.Element[];
}

const CustomCard = ({ children }: CustomCardProps): JSX.Element => {
  return (
    <>
      <Card>
        <CardActionArea>{children}</CardActionArea>
      </Card>
    </>
  );
};

interface MediaProps {
  imagePath: string;
  imageAltText: string;
}

const Media = ({ imagePath, imageAltText }: MediaProps): JSX.Element => {
  return (
    <>
      <CardMedia
        component="img"
        height="140"
        image={imagePath}
        alt={imageAltText}
      />
    </>
  );
};

interface ContentProps {
  subtitle: string;
  children: JSX.Element;
}

const Content = ({ subtitle, children }: ContentProps): JSX.Element => {
  return (
    <>
      <CardContent>
        <Typography variant={"h5"}>{subtitle}</Typography>
        <Typography variant={"body2"}>{children}</Typography>
      </CardContent>
    </>
  );
};

CustomCard.Media = Media;
CustomCard.Content = Content;

export default CustomCard;
