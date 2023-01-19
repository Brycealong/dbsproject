from django.shortcuts import render, HttpResponse, redirect
from django.db import models, connection


# 接收GET请求数据
def search(request):
    if request.GET and request.method == "GET":
        name = request.GET.get("nm")
        if(len(name)>4):
            sql_str = "select A.Interaction_ID, B.Protein_Name, C.Protein_Name from Interaction_interaction as A, Interaction_organism as B, Interaction_organism as C where A.Protein_ID_A = B.Protein_ID AND A.Protein_ID_B = C.Protein_ID AND B.Organism_Name = %s"
            cursor=connection.cursor()
            cursor.execute(sql_str,[name])
            data_list = cursor.fetchall()
            return render(request,"Organism.html",locals())
        
        sql_str = "select Interaction_interaction.Interaction_ID, Interaction_organism.Organism_Name, Interaction_organism.Protein_Name from Interaction_interaction join Interaction_organism where Interaction_interaction.Protein_ID_B = Interaction_organism.Protein_ID AND Protein_ID_A in (select Protein_ID from Interaction_organism where Protein_Name = %s)"
        cursor=connection.cursor()
        cursor.execute(sql_str,[name])
        result = cursor.fetchall()
        return render(request,"Protein.html",locals())

