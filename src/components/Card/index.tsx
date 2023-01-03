import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

interface CustomCardProps {
  title: string;
  imagePath: string;
  imageAltText: string;
  children: JSX.Element;
}

export const CustomCard = ({
  title,
  children,
  imagePath,
  imageAltText,
}: CustomCardProps): JSX.Element => {
  return (
    <>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={imagePath}
            alt={imageAltText}
          />
          <CardContent>
            <Typography variant={"h5"}>{title}</Typography>
            {children}
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
